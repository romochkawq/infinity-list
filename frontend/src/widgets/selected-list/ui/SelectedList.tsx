import {
	closestCenter,
	DndContext,
	PointerSensor,
	useSensor,
	useSensors,
	type DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { FETCH_THROTTLE_MS } from '@infinity/common';
import type { ItemId } from '@infinity/common';
import { useEffect, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { useDeselectItem } from '@features/deselect-item';
import { FilterInput } from '@features/filter-items';
import { useReorderItem } from '@features/reorder-item';
import { useThrottledCallback } from '@shared/lib/use-throttled-callback';
import { ListEmpty, ListError, ListLoading, ListStatus, Pane, Spinner } from '@shared/ui';

import { useSelectedItems } from '../model/use-selected-items';

import { SortableItemRow } from './SortableItemRow';

export function SelectedList() {
	const [search, setSearch] = useState('');
	const deselect = useDeselectItem();
	const reorder = useReorderItem();
	const {
		items,
		dataUpdatedAt,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError,
		fetchNextPage,
	} = useSelectedItems(search);

	const [override, setOverride] = useState<ItemId[] | null>(null);
	useEffect(() => {
		setOverride(null);
	}, [items, dataUpdatedAt]);

	const view = override ?? items;

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
	);

	const loadMore = useThrottledCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage().catch(() => undefined);
		}
	}, FETCH_THROTTLE_MS);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		if (over === null || active.id === over.id) {
			return;
		}
		const from = view.indexOf(Number(active.id));
		const to = view.indexOf(Number(over.id));
		if (from < 0 || to < 0) {
			return;
		}
		const next = arrayMove(view, from, to);
		setOverride(next);
		const movedIndex = next.indexOf(Number(active.id));
		const afterId = movedIndex === 0 ? null : (next[movedIndex - 1] ?? null);
		reorder(Number(active.id), afterId);
	};

	return (
		<Pane
			title="Выбранные"
			count={isLoading ? '' : `${view.length}${hasNextPage ? '+' : ''}`}
			toolbar={<FilterInput value={search} onChange={setSearch} />}
		>
			{isLoading ? (
				<ListLoading />
			) : isError ? (
				<ListError text="Не удалось загрузить список" />
			) : view.length === 0 ? (
				<ListEmpty text="Пока ничего не выбрано" />
			) : (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext items={view} strategy={verticalListSortingStrategy}>
						<Virtuoso
							data={view}
							endReached={loadMore}
							increaseViewportBy={400}
							computeItemKey={(_, id) => id}
							itemContent={(_, id) => (
								<SortableItemRow id={id} onDeselect={deselect} />
							)}
							components={{
								Footer: () =>
									isFetchingNextPage ? (
										<ListStatus>
											<Spinner />
										</ListStatus>
									) : null,
							}}
						/>
					</SortableContext>
				</DndContext>
			)}
		</Pane>
	);
}
