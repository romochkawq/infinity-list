import type { ItemId } from '@infinity/common';
import { useCallback } from 'react';

import { useQueues } from '@app/providers/queue-context';
import { useSelectionStore } from '@shared/store/selection-store';

export function useSelectItem(): (id: ItemId) => void {
	const { mutationQueue } = useQueues();
	const selectOptimistic = useSelectionStore((state) => state.selectOptimistic);

	return useCallback(
		(id: ItemId) => {
			selectOptimistic(id);
			mutationQueue.enqueue({ type: 'select', itemId: id });
		},
		[mutationQueue, selectOptimistic],
	);
}
