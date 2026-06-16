import { Input } from '@shared/ui';

interface FilterInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

const DIGITS_ONLY = /\D/g;

export function FilterInput({ value, onChange, placeholder }: FilterInputProps) {
	return (
		<Input
			inputMode="numeric"
			value={value}
			placeholder={placeholder ?? 'Фильтр по ID'}
			onChange={(event) => onChange(event.target.value.replace(DIGITS_ONLY, ''))}
		/>
	);
}
