import type { ItemId } from '@infinity/common';
import { useCallback } from 'react';

import { useQueues } from '@app/providers/queue-context';

export function useReorderItem(): (itemId: ItemId, afterId: ItemId | null) => void {
	const { mutationQueue } = useQueues();

	return useCallback(
		(itemId: ItemId, afterId: ItemId | null) => {
			mutationQueue.enqueue({ type: 'reorder', itemId, afterId });
		},
		[mutationQueue],
	);
}
