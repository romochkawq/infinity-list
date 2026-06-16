import type { ItemId } from '@infinity/common';

export interface StateRepository {
	addItems(ids: readonly ItemId[]): Promise<ItemId[]>;
	select(id: ItemId): Promise<void>;
	deselect(id: ItemId): Promise<void>;
	reorder(itemId: ItemId, afterId: ItemId | null): Promise<void>;
	getSelectedSet(): Promise<ReadonlySet<ItemId>>;
	getSelectedOrder(): Promise<readonly ItemId[]>;
	getCustomIds(): Promise<readonly ItemId[]>;
}
