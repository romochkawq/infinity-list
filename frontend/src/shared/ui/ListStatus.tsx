import styles from './ListStatus.module.css';
import { Spinner } from './Spinner';

export function ListStatus({ children }: { children: React.ReactNode }) {
	return <div className={styles.status}>{children}</div>;
}

export function ListLoading() {
	return (
		<ListStatus>
			<Spinner />
		</ListStatus>
	);
}

export function ListEmpty({ text }: { text: string }) {
	return <ListStatus>{text}</ListStatus>;
}

export function ListError({ text }: { text: string }) {
	return <ListStatus>{text}</ListStatus>;
}
