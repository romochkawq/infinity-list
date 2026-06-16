import type { GetSelectedQuery, ItemId, OffsetPage } from '@infinity/common';

import type { StateRepository } from '../domain/ports.js';

import { clampLimit, clampOffset } from './pagination.js';

/**
 * Правая панель «выбранные»: индексная пагинация по явному `selectedOrder`
 * с substring-фильтром по ID. Возвращает срез `offset/limit`, общий `total`
 * (по отфильтрованному списку) и `hasMore`.
 */
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
