import { MAX_BASE_ID } from '@infinity/common';
import type { ItemId } from '@infinity/common';

import { badRequest, notFound } from './errors.js';

/**
 * Доменный агрегат состояния выбора. Чистый, без зависимостей от фреймворка.
 *
 * Вселенная элементов = базовый диапазон `1..MAX_BASE_ID` ∪ добавленные
 * пользователем `customIds` (всегда `> MAX_BASE_ID`). Инварианты выбора и
 * порядка живут здесь; инфраструктура лишь оборачивает агрегат async-портом.
 */
export class SelectionState {
	private readonly customIds = new Set<ItemId>();
	private readonly selectedSet = new Set<ItemId>();
	private readonly selectedOrder: ItemId[] = [];

	/** Существует ли элемент во вселенной (базовый диапазон или custom). */
	hasItem(id: ItemId): boolean {
		if (Number.isInteger(id) && id >= 1 && id <= MAX_BASE_ID) {
			return true;
		}
		return this.customIds.has(id);
	}

	isSelected(id: ItemId): boolean {
		return this.selectedSet.has(id);
	}

	/** Идемпотентное добавление нового custom-ID. Возвращает `true`, если ID появился. */
	addItem(id: ItemId): boolean {
		if (this.hasItem(id)) {
			return false;
		}
		this.customIds.add(id);
		return true;
	}

	/** Идемпотентный выбор: повтор не создаёт дубликат, порядок дополняется в конец. */
	select(id: ItemId): void {
		if (!this.hasItem(id)) {
			throw notFound(`Item ${id} does not exist`);
		}
		if (this.selectedSet.has(id)) {
			return;
		}
		this.selectedSet.add(id);
		this.selectedOrder.push(id);
	}

	/** Идемпотентное снятие выбора: если элемент не выбран — no-op. */
	deselect(id: ItemId): void {
		if (!this.selectedSet.delete(id)) {
			return;
		}
		const index = this.selectedOrder.indexOf(id);
		if (index >= 0) {
			this.selectedOrder.splice(index, 1);
		}
	}

	/**
	 * Anchor-based перемещение: поставить `itemId` сразу после `afterId`
	 * (или в начало при `afterId === null`). Оба ID должны быть выбраны.
	 */
	reorder(itemId: ItemId, afterId: ItemId | null): void {
		if (!this.selectedSet.has(itemId)) {
			throw badRequest(`Item ${itemId} is not selected`);
		}
		if (afterId === itemId) {
			throw badRequest('Cannot reorder an item relative to itself');
		}
		if (afterId !== null && !this.selectedSet.has(afterId)) {
			throw badRequest(`Anchor ${afterId} is not selected`);
		}

		const from = this.selectedOrder.indexOf(itemId);
		this.selectedOrder.splice(from, 1);

		if (afterId === null) {
			this.selectedOrder.unshift(itemId);
			return;
		}
		const anchor = this.selectedOrder.indexOf(afterId);
		this.selectedOrder.splice(anchor + 1, 0, itemId);
	}

	/** Live-ссылка на множество выбранных (для быстрых проверок в пагинации). */
	getSelectedSet(): ReadonlySet<ItemId> {
		return this.selectedSet;
	}

	/** Live-ссылка на порядок выбранных (только для чтения). */
	getSelectedOrder(): readonly ItemId[] {
		return this.selectedOrder;
	}

	/** Отсортированная по возрастанию копия custom-ID. */
	getCustomIds(): readonly ItemId[] {
		return [...this.customIds].sort((a, b) => a - b);
	}
}
