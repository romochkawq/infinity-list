import { MAX_MUTATION_BATCH, MUTATION_BATCH_MS } from '@infinity/common';
import type { ItemId, Mutation } from '@infinity/common';

import { applyMutations } from '../../api/endpoints';

import { FlushTimer } from './batch-queue';

export interface MutationQueueDeps {
	onFlushed?: (ops: Mutation[]) => void;
	onError?: (error: unknown) => void;
}

export class MutationQueue {
	private ops: Mutation[] = [];
	private readonly timer: FlushTimer;

	constructor(private readonly deps: MutationQueueDeps = {}) {
		this.timer = new FlushTimer({
			intervalMs: MUTATION_BATCH_MS,
			flush: () => this.flush(),
			onError: deps.onError,
		});
	}

	enqueue(op: Mutation): void {
		this.collapse(op);
		this.timer.schedule();
	}

	private collapse(op: Mutation): void {
		const id = op.itemId;
		if (op.type === 'select') {
			const hadDeselect = this.removeWhere(id, 'deselect');
			this.removeWhere(id, 'select');
			if (!hadDeselect) {
				this.ops.push(op);
			}
			return;
		}
		if (op.type === 'deselect') {
			const hadSelect = this.removeWhere(id, 'select');
			this.removeWhere(id, 'deselect');
			this.removeWhere(id, 'reorder');
			if (!hadSelect) {
				this.ops.push(op);
			}
			return;
		}
		this.removeWhere(id, 'reorder');
		this.ops.push(op);
	}

	private removeWhere(id: ItemId, type: Mutation['type']): boolean {
		const before = this.ops.length;
		this.ops = this.ops.filter((op) => !(op.itemId === id && op.type === type));
		return this.ops.length !== before;
	}

	private async flush(): Promise<void> {
		if (this.ops.length === 0) {
			return;
		}
		const batch = this.ops.slice(0, MAX_MUTATION_BATCH);
		this.ops = this.ops.slice(MAX_MUTATION_BATCH);
		await applyMutations({ ops: batch });
		this.deps.onFlushed?.(batch);
		if (this.ops.length > 0) {
			this.timer.schedule();
		}
	}

	stop(): void {
		this.timer.stop();
	}
}
