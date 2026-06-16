import { AvailableList } from '@widgets/available-list';
import { SelectedList } from '@widgets/selected-list';

import styles from './MainPage.module.css';

export function MainPage() {
	return (
		<div className={styles.page}>
			<header className={styles.head}>
				<h1 className={styles.title}>Infinity List</h1>
				<p className={styles.subtitle}>
					Выбор и сортировка из 1 000 000 элементов
				</p>
			</header>
			<div className={styles.panes}>
				<AvailableList />
				<SelectedList />
			</div>
		</div>
	);
}
