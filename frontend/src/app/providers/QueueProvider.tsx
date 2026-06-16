import { useQueryClient } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';

import { AddQueue, MutationQueue } from '@shared/lib/queue';
import { useSelectionStore } from '@shared/store/selection-store';

import { QueueContext } from './queue-context';

export function QueueProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();

	const api = useMemo(() => {
		const invalidateAvailable = () =>
			queryClient.invalidateQueries({ queryKey: ['items', 'available'] });
		const invalidateSelected = () =>
			queryClient.invalidateQueries({ queryKey: ['items', 'selected'] });

		const addQueue = new AddQueue({
			onFlushed: (ids) => {
				invalidateAvailable()
					.then(() => useSelectionStore.getState().clearAdded(ids))
					.catch(() => undefined);
			},
		});
		const mutationQueue = new MutationQueue({
			onFlushed: (ops) => {
				const ids = ops.map((op) => op.itemId);
				Promise.all([invalidateAvailable(), invalidateSelected()])
					.then(() => useSelectionStore.getState().clearPending(ids))
					.catch(() => undefined);
			},
		});
		return { addQueue, mutationQueue };
	}, [queryClient]);

	useEffect(
		() => () => {
			api.addQueue.stop();
			api.mutationQueue.stop();
		},
		[api],
	);

	return <QueueContext.Provider value={api}>{children}</QueueContext.Provider>;
}
