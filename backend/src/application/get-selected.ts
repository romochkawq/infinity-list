import type { GetSelectedQuery, ItemId, OffsetPage } from '@infinity/common';

import type { StateRepository } from '../domain/ports';

import { clampLimit, clampOffset } from './pagination';

export class GetSelected {
	constructor(private readonly repo: StateRepository) {}

	async execute(query: GetSelectedQuery): Promise<OffsetPage> {
		const limit = clampLimit(query.limit);
		const offset = clampOffset(query.offset);
		const search = query.search ?? '';

		const order = await this.repo.getSelectedOrder();
		const filtered: readonly ItemId[] =
			search === '' ? order : order.filter((id) => String(id).includes(search));

		const total = filtered.length;
		const items = filtered.slice(offset, offset + limit);
		const hasMore = offset + items.length < total;

		return { items, total, hasMore };
	}
}
