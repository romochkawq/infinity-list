import { ADD_BATCH_MS, MAX_ADD_BATCH } from '@infinity/common';
import type { ItemId } from '@infinity/common';

import { addItems } from '../../api/endpoints';

import { FlushTimer } from './batch-queue';

export interface AddQueueDeps {
	onFlushed?: (ids: ItemId[]) => void;
	onError?: (error: unknown) => void;
}

export class AddQueue {
	private readonly pending = new Set<ItemId>();
	private readonly timer: FlushTimer;

	constructor(private readonly deps: AddQueueDeps = {}) {
		this.timer = new FlushTimer({
			intervalMs: ADD_BATCH_MS,
			flush: () => this.flush(),
			onError: deps.onError,
		});
	}

	enqueue(id: ItemId): void {
		this.pending.add(id);
		this.timer.schedule();
	}

	private async flush(): Promise<void> {
		if (this.pending.size === 0) {
			return;
		}
		const ids = Array.from(this.pending).slice(0, MAX_ADD_BATCH);
		for (const id of ids) {
			this.pending.delete(id);
		}
		await addItems({ ids });
		this.deps.onFlushed?.(ids);
		if (this.pending.size > 0) {
			this.timer.schedule();
		}
	}

	stop(): void {
		this.timer.stop();
	}
}
