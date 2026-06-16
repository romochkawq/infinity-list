import type { AddItemsRequest, AddItemsResponse } from '@infinity/common';

import type { StateRepository } from '../domain/ports';

export class AddItems {
	constructor(private readonly repo: StateRepository) {}

	async execute(request: AddItemsRequest): Promise<AddItemsResponse> {
		const unique = [...new Set(request.ids)];
		const added = await this.repo.addItems(unique);
		return { added };
	}
}
