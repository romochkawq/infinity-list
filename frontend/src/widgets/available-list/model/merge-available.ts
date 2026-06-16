import type { ItemId } from '@infinity/common';

function matchesSearch(id: ItemId, search: string): boolean {
	return search === '' || String(id).includes(search);
}

export function mergeAvailable(
	serverItems: ItemId[],
	overlay: {
		addedIds: ItemId[];
		pendingSelected: ItemId[];
		pendingDeselected: ItemId[];
		search: string;
	},
): ItemId[] {
	const hidden = new Set(overlay.pendingSelected);
	const present = new Set<ItemId>();
	const result: ItemId[] = [];

	for (const id of serverItems) {
		if (hidden.has(id) || present.has(id)) {
			continue;
		}
		present.add(id);
		result.push(id);
	}

	const extras = [...overlay.addedIds, ...overlay.pendingDeselected].filter(
		(id) => !hidden.has(id) && !present.has(id) && matchesSearch(id, overlay.search),
	);

	for (const id of extras) {
		if (present.has(id)) {
			continue;
		}
		present.add(id);
		result.push(id);
	}

	return result.sort((a, b) => a - b);
}
