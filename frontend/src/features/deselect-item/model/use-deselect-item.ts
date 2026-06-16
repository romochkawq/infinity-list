import type { ItemId } from '@infinity/common';
import { useCallback } from 'react';

import { useQueues } from '@app/providers/queue-context';
import { useSelectionStore } from '@shared/store/selection-store';

export function useDeselectItem(): (id: ItemId) => void {
	const { mutationQueue } = useQueues();
	const deselectOptimistic = useSelectionStore((state) => state.deselectOptimistic);

	return useCallback(
		(id: ItemId) => {
			deselectOptimistic(id);
			mutationQueue.enqueue({ type: 'deselect', itemId: id });
		},
		[mutationQueue, deselectOptimistic],
	);
}
