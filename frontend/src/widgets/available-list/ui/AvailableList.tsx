import { FETCH_THROTTLE_MS } from '@infinity/common';
import { useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

import { ItemRow } from '@entities/item';
import { AddItem } from '@features/add-item';
import { FilterInput } from '@features/filter-items';
import { useSelectItem } from '@features/select-item';
import { useThrottledCallback } from '@shared/lib/use-throttled-callback';
import {
	Button,
	ListEmpty,
	ListError,
	ListLoading,
	ListStatus,
	Pane,
	Spinner,
} from '@shared/ui';

import { useAvailableItems } from '../model/use-available-items';

export function AvailableList() {
	const [search, setSearch] = useState('');
	const select = useSelectItem();
	const { items, hasNextPage, isFetchingNextPage, isLoading, isError, fetchNextPage } =
		useAvailableItems(search);

	const loadMore = useThrottledCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage().catch(() => undefined);
		}
	}, FETCH_THROTTLE_MS);

	return (
		<Pane
			title="Доступные"
			count={isLoading ? '' : `${items.length}${hasNextPage ? '+' : ''}`}
			toolbar={
				<>
					<AddItem />
					<FilterInput value={search} onChange={setSearch} />
				</>
			}
		>
			{isLoading ? (
				<ListLoading />
			) : isError ? (
				<ListError text="Не удалось загрузить список" />
			) : items.length === 0 ? (
				<ListEmpty text="Ничего не найдено" />
			) : (
				<Virtuoso
					data={items}
					endReached={loadMore}
					increaseViewportBy={400}
					computeItemKey={(_, id) => id}
					itemContent={(_, id) => (
						<ItemRow
							id={id}
							action={<Button onClick={() => select(id)}>Выбрать</Button>}
						/>
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
			)}
		</Pane>
	);
}
