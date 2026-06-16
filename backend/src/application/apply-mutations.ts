import type { ApplyMutationsRequest, ApplyMutationsResponse } from '@infinity/common';

import { badRequest } from '../domain/errors';
import type { StateRepository } from '../domain/ports';

export class ApplyMutations {
	constructor(private readonly repo: StateRepository) {}

	async execute(request: ApplyMutationsRequest): Promise<ApplyMutationsResponse> {
		for (const op of request.ops) {
			switch (op.type) {
				case 'select':
					await this.repo.select(op.itemId);
					break;
				case 'deselect':
					await this.repo.deselect(op.itemId);
					break;
				case 'reorder':
					await this.repo.reorder(op.itemId, op.afterId);
					break;
				default: {
					const _exhaustive: never = op;
					throw badRequest(`Unknown mutation: ${JSON.stringify(_exhaustive)}`);
				}
			}
		}
		return { applied: request.ops.length };
	}
}
