import { PAGE_SIZE } from '@infinity/common';
import type { CursorPage, ItemId } from '@infinity/common';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchAvailable } from '@shared/api/endpoints';
import { queryKeys } from '@shared/api/query-keys';
import { useSelectionStore } from '@shared/store/selection-store';

import { mergeAvailable } from './merge-available';

export function useAvailableItems(search: string) {
	const query = useInfiniteQuery({
		queryKey: queryKeys.available(search),
		initialPageParam: undefined as ItemId | undefined,
		queryFn: ({ pageParam, signal }) =>
			fetchAvailable({ cursor: pageParam, limit: PAGE_SIZE, search }, signal),
		getNextPageParam: (lastPage: CursorPage) => lastPage.nextCursor ?? undefined,
	});

	const addedIds = useSelectionStore((state) => state.addedIds);
	const pendingSelected = useSelectionStore((state) => state.pendingSelected);
	const pendingDeselected = useSelectionStore((state) => state.pendingDeselected);

	const serverItems = useMemo(
		() => (query.data?.pages ?? []).flatMap((page) => page.items),
		[query.data],
	);

	const items = useMemo(
		() =>
			mergeAvailable(serverItems, {
				addedIds,
				pendingSelected,
				pendingDeselected,
				search,
			}),
		[serverItems, addedIds, pendingSelected, pendingDeselected, search],
	);

	return {
		items,
		hasNextPage: query.hasNextPage,
		isFetchingNextPage: query.isFetchingNextPage,
		isLoading: query.isLoading,
		isError: query.isError,
		fetchNextPage: query.fetchNextPage,
	};
}
