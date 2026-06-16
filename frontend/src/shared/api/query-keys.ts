export const queryKeys = {
	available: (search: string) => ['items', 'available', search] as const,
	selected: (search: string) => ['items', 'selected', search] as const,
};
