import type { ItemId } from '@infinity/common';

/**
 * Порт хранилища состояния. Все методы async (`Promise<...>`), чтобы in-memory
 * реализацию можно было заменить на БД без изменения use-cases.
 */
export interface StateRepository {
	/** Идемпотентное батч-добавление. Возвращает реально добавленные ID. */
	addItems(ids: readonly ItemId[]): Promise<ItemId[]>;

	/** Идемпотентный выбор; бросает, если элемента нет во вселенной. */
	select(id: ItemId): Promise<void>;

	/** Идемпотентное снятие выбора. */
	deselect(id: ItemId): Promise<void>;

	/** Anchor-based перемещение в порядке выбранных. */
	reorder(itemId: ItemId, afterId: ItemId | null): Promise<void>;

	/** Множество выбранных ID — для исключения из левой панели. */
	getSelectedSet(): Promise<ReadonlySet<ItemId>>;

	/** Порядок выбранных ID — основа правой панели. */
	getSelectedOrder(): Promise<readonly ItemId[]>;

	/** Отсортированные custom-ID (> MAX_BASE_ID) — хвост левой панели. */
	getCustomIds(): Promise<readonly ItemId[]>;
}
