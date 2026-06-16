import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useState } from 'react';

import { QueueProvider } from './QueueProvider';

function createQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 1_000,
				refetchOnWindowFocus: false,
				retry: 1,
			},
		},
	});
}

export function AppProviders({ children }: { children: ReactNode }) {
	const [queryClient] = useState(createQueryClient);

	return (
		<QueryClientProvider client={queryClient}>
			<QueueProvider>{children}</QueueProvider>
		</QueryClientProvider>
	);
}
