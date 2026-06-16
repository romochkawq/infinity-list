import type { ItemId } from '@infinity/common';
import { create } from 'zustand';

interface SelectionState {
	addedIds: ItemId[];
	pendingSelected: ItemId[];
	pendingDeselected: ItemId[];

	addCustomId: (id: ItemId) => void;
	selectOptimistic: (id: ItemId) => void;
	deselectOptimistic: (id: ItemId) => void;
	reconcile: (serverSelected: ReadonlySet<ItemId>) => void;
}

function without(list: ItemId[], id: ItemId): ItemId[] {
	return list.filter((value) => value !== id);
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

	reconcile: (serverSelected) =>
		set((state) => {
			const pendingSelected = state.pendingSelected.filter(
				(id) => !serverSelected.has(id),
			);
			const pendingDeselected = state.pendingDeselected.filter((id) =>
				serverSelected.has(id),
			);
			if (
				pendingSelected.length === state.pendingSelected.length &&
				pendingDeselected.length === state.pendingDeselected.length
			) {
				return state;
			}
			return { pendingSelected, pendingDeselected };
		}),
}));
