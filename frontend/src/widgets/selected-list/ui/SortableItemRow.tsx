import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { ItemRow, type ItemId } from '@entities/item';
import { Button } from '@shared/ui';

import styles from './SortableItemRow.module.css';

interface SortableItemRowProps {
	id: ItemId;
	onDeselect: (id: ItemId) => void;
}

export function SortableItemRow({ id, onDeselect }: SortableItemRowProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
		useSortable({ id });

	return (
		<div
			ref={setNodeRef}
			className={styles.wrapper}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
				opacity: isDragging ? 0.5 : 1,
			}}
		>
			<ItemRow
				id={id}
				handle={
					<button
						type="button"
						className={styles.handle}
						aria-label="Перетащить"
						{...attributes}
						{...listeners}
					>
						⠿
					</button>
				}
				action={<Button onClick={() => onDeselect(id)}>Убрать</Button>}
			/>
		</div>
	);
}
