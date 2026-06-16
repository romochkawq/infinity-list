import type { ItemId } from '@infinity/common';
import { create } from 'zustand';

interface SelectionState {
	addedIds: ItemId[];
	pendingSelected: ItemId[];
	pendingDeselected: ItemId[];

	addCustomId: (id: ItemId) => void;
	selectOptimistic: (id: ItemId) => void;
	deselectOptimistic: (id: ItemId) => void;
	clearPending: (ids: ItemId[]) => void;
	clearAdded: (ids: ItemId[]) => void;
}

function without(list: ItemId[], id: ItemId): ItemId[] {
	return list.filter((value) => value !== id);
}

function withoutMany(list: ItemId[], ids: ReadonlySet<ItemId>): ItemId[] {
	return list.filter((value) => !ids.has(value));
}

export const useSelectionStore = create<SelectionState>((set) => ({
	addedIds: [],
	pendingSelected: [],
	pendingDeselected: [],

	addCustomId: (id) =>
		set((state) =>
			state.addedIds.includes(id) ? state : { addedIds: [...state.addedIds, id] },
		),

	selectOptimistic: (id) =>
		set((state) => ({
			pendingDeselected: without(state.pendingDeselected, id),
			pendingSelected: state.pendingSelected.includes(id)
				? state.pendingSelected
				: [...state.pendingSelected, id],
		})),

	deselectOptimistic: (id) =>
		set((state) => ({
			pendingSelected: without(state.pendingSelected, id),
			pendingDeselected: state.pendingDeselected.includes(id)
				? state.pendingDeselected
				: [...state.pendingDeselected, id],
		})),

	clearPending: (ids) =>
		set((state) => {
			const set_ = new Set(ids);
			return {
				pendingSelected: withoutMany(state.pendingSelected, set_),
				pendingDeselected: withoutMany(state.pendingDeselected, set_),
			};
		}),

	clearAdded: (ids) =>
		set((state) => ({ addedIds: withoutMany(state.addedIds, new Set(ids)) })),
}));
