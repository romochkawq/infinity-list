import { MAX_BASE_ID } from '@infinity/common';
import { useState } from 'react';

import { useQueues } from '@app/providers/queue-context';
import { useSelectionStore } from '@shared/store/selection-store';
import { Button, Input } from '@shared/ui';

import styles from './AddItem.module.css';

const DIGITS_ONLY = /\D/g;

export function AddItem() {
	const [value, setValue] = useState('');
	const { addQueue } = useQueues();
	const addCustomId = useSelectionStore((state) => state.addCustomId);

	const id = Number(value);
	const isValid = value !== '' && Number.isInteger(id) && id > MAX_BASE_ID;

	const submit = () => {
		if (!isValid) {
			return;
		}
		addCustomId(id);
		addQueue.enqueue(id);
		setValue('');
	};

	return (
		<form
			className={styles.form}
			onSubmit={(event) => {
				event.preventDefault();
				submit();
			}}
		>
			<Input
				inputMode="numeric"
				value={value}
				placeholder={`Новый ID (> ${MAX_BASE_ID})`}
				onChange={(event) =>
					setValue(event.target.value.replace(DIGITS_ONLY, ''))
				}
			/>
			<Button type="submit" variant="primary" disabled={!isValid}>
				Добавить
			</Button>
		</form>
	);
}
