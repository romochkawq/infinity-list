import { MAX_BASE_ID } from '@infinity/common';
import type { CursorPage, GetAvailableQuery, ItemId } from '@infinity/common';

import type { StateRepository } from '../domain/ports.js';

import { clampLimit } from './pagination.js';

/**
 * Левая панель «доступные»: курсорная пагинация по натуральному порядку ID
 * (`1..MAX_BASE_ID`, затем отсортированные custom-ID), исключая выбранные и
 * применяя substring-фильтр. Курсор `cursor` — последний отданный ID (exclusive),
 * поэтому стабилен при мутациях общего состояния.
 */
export class GetAvailable {
	constructor(private readonly repo: StateRepository) {}

	async execute(query: GetAvailableQuery): Promise<CursorPage> {
		const limit = clampLimit(query.limit);
		const cursor = query.cursor ?? 0;
		const search = query.search ?? '';

		const selected = await this.repo.getSelectedSet();
		const customIds = await this.repo.getCustomIds();

		const matches = (id: ItemId): boolean =>
			!selected.has(id) && (search === '' || String(id).includes(search));

		// Берём limit + 1, чтобы достоверно определить hasMore без отдельного запроса.
		const want = limit + 1;
		const collected: ItemId[] = [];

		for (let id = Math.max(cursor + 1, 1); id <= MAX_BASE_ID; id++) {
			if (collected.length >= want) {
				break;
			}
			if (matches(id)) {
				collected.push(id);
			}
		}

		if (collected.length < want) {
			for (const id of customIds) {
				if (id <= cursor) {
					continue;
				}
				if (collected.length >= want) {
					break;
				}
				if (matches(id)) {
					collected.push(id);
				}
			}
		}

		const hasMore = collected.length > limit;
		const items = hasMore ? collected.slice(0, limit) : collected;
		const last = items.at(-1);
		const nextCursor = hasMore && last !== undefined ? last : null;

		return { items, nextCursor, hasMore };
	}
}
