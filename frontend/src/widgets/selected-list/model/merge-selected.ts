import type { ItemId } from '@infinity/common';

function matchesSearch(id: ItemId, search: string): boolean {
	return search === '' || String(id).includes(search);
}

export function mergeSelected(
	serverItems: ItemId[],
	overlay: {
		pendingSelected: ItemId[];
		pendingDeselected: ItemId[];
		search: string;
	},
): ItemId[] {
	const removed = new Set(overlay.pendingDeselected);
	const present = new Set<ItemId>();
	const result: ItemId[] = [];

	for (const id of serverItems) {
		if (removed.has(id) || present.has(id)) {
			continue;
		}
		present.add(id);
		result.push(id);
	}

	for (const id of overlay.pendingSelected) {
		if (present.has(id) || removed.has(id) || !matchesSearch(id, overlay.search)) {
			continue;
		}
		present.add(id);
		result.push(id);
	}

	return result;
}
