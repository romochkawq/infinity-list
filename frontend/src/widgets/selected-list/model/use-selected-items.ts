import { PAGE_SIZE } from '@infinity/common';
import type { OffsetPage } from '@infinity/common';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { fetchSelected } from '@shared/api/endpoints';
import { queryKeys } from '@shared/api/query-keys';
import { useSelectionStore } from '@shared/store/selection-store';

import { mergeSelected } from './merge-selected';

export function useSelectedItems(search: string) {
	const query = useInfiniteQuery({
		queryKey: queryKeys.selected(search),
		initialPageParam: 0,
		queryFn: ({ pageParam, signal }) =>
			fetchSelected({ offset: pageParam, limit: PAGE_SIZE, search }, signal),
		getNextPageParam: (lastPage: OffsetPage, allPages) =>
			lastPage.hasMore
				? allPages.reduce((sum, page) => sum + page.items.length, 0)
				: undefined,
	});

	const pendingSelected = useSelectionStore((state) => state.pendingSelected);
	const pendingDeselected = useSelectionStore((state) => state.pendingDeselected);

	const serverItems = useMemo(
		() => (query.data?.pages ?? []).flatMap((page) => page.items),
		[query.data],
	);

	const items = useMemo(
		() => mergeSelected(serverItems, { pendingSelected, pendingDeselected, search }),
		[serverItems, pendingSelected, pendingDeselected, search],
	);

	return {
		items,
		dataUpdatedAt: query.dataUpdatedAt,
		hasNextPage: query.hasNextPage,
		isFetchingNextPage: query.isFetchingNextPage,
		isLoading: query.isLoading,
		isError: query.isError,
		fetchNextPage: query.fetchNextPage,
	};
}
