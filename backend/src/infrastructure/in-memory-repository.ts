import type { ItemId } from '@infinity/common';

import type { StateRepository } from '../domain/ports.js';
import { SelectionState } from '../domain/selection-state.js';

/**
 * In-memory реализация порта: тонкий async-адаптер над доменным агрегатом
 * `SelectionState`. Состояние общее на процесс (по ТЗ — без БД). Сигнатуры
 * async, поэтому позже подменяется на, например, `PostgresStateRepository`.
 */
export class InMemoryRepository implements StateRepository {
	private readonly state = new SelectionState();

	async addItems(ids: readonly ItemId[]): Promise<ItemId[]> {
		const added: ItemId[] = [];
		for (const id of ids) {
			if (this.state.addItem(id)) {
				added.push(id);
			}
		}
		return added;
	}

	async select(id: ItemId): Promise<void> {
		this.state.select(id);
	}

	async deselect(id: ItemId): Promise<void> {
		this.state.deselect(id);
	}

	async reorder(itemId: ItemId, afterId: ItemId | null): Promise<void> {
		this.state.reorder(itemId, afterId);
	}

	async getSelectedSet(): Promise<ReadonlySet<ItemId>> {
		return this.state.getSelectedSet();
	}

	async getSelectedOrder(): Promise<readonly ItemId[]> {
		return this.state.getSelectedOrder();
	}

	async getCustomIds(): Promise<readonly ItemId[]> {
		return this.state.getCustomIds();
	}
}
