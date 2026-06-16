import { createContext, useContext } from 'react';

import type { AddQueue, MutationQueue } from '@shared/lib/queue';

export interface QueueApi {
	addQueue: AddQueue;
	mutationQueue: MutationQueue;
}

export const QueueContext = createContext<QueueApi | null>(null);

export function useQueues(): QueueApi {
	const ctx = useContext(QueueContext);
	if (ctx === null) {
		throw new Error('useQueues must be used within QueueProvider');
	}
	return ctx;
}
