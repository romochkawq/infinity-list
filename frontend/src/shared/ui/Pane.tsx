import type { ReactNode } from 'react';

import styles from './Pane.module.css';

interface PaneProps {
	title: string;
	count?: ReactNode;
	toolbar?: ReactNode;
	children: ReactNode;
}

export function Pane({ title, count, toolbar, children }: PaneProps) {
	return (
		<section className={styles.pane}>
			<header className={styles.header}>
				<h2 className={styles.title}>{title}</h2>
				{count !== undefined ? (
					<span className={styles.count}>{count}</span>
				) : null}
			</header>
			{toolbar ? <div className={styles.toolbar}>{toolbar}</div> : null}
			<div className={styles.body}>{children}</div>
		</section>
	);
}
