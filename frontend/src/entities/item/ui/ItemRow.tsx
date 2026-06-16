import type { ReactNode } from 'react';

import type { ItemId } from '../model/types';

import styles from './ItemRow.module.css';

interface ItemRowProps {
	id: ItemId;
	action?: ReactNode;
	handle?: ReactNode;
}

export function ItemRow({ id, action, handle }: ItemRowProps) {
	return (
		<div className={styles.row}>
			{handle}
			<span className={styles.id}>{id}</span>
			{action ? <span className={styles.action}>{action}</span> : null}
		</div>
	);
}
