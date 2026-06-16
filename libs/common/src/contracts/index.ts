/** Идентификатор элемента (положительное целое). */
export type ItemId = number;

/** Курсорная страница (левая панель «доступные»). */
export interface CursorPage {
	items: ItemId[];
	nextCursor: ItemId | null;
	hasMore: boolean;
}

/** Индексная страница (правая панель «выбранные»). */
export interface OffsetPage {
	items: ItemId[];
	total: number;
	hasMore: boolean;
}

/** Запрос левой панели. */
export interface GetAvailableQuery {
	cursor?: ItemId;
	limit?: number;
	search?: string;
}

/** Запрос правой панели. */
export interface GetSelectedQuery {
	offset?: number;
	limit?: number;
	search?: string;
}

/** Батч-добавление новых ID (идемпотентно). */
export interface AddItemsRequest {
	ids: ItemId[];
}

export interface AddItemsResponse {
	/** ID, реально добавленные в этот раз (без уже существовавших). */
	added: ItemId[];
}

/** Виды мутаций состояния выбора/порядка. */
export type MutationType = 'select' | 'deselect' | 'reorder';

export interface SelectMutation {
	type: 'select';
	itemId: ItemId;
}

export interface DeselectMutation {
	type: 'deselect';
	itemId: ItemId;
}

/**
 * Anchor-based reorder: переместить `itemId` так, чтобы он встал сразу после
 * `afterId`. `afterId === null` означает перемещение в начало списка.
 * Корректно работает при фильтрации и инфинити-скролле.
 */
export interface ReorderMutation {
	type: 'reorder';
	itemId: ItemId;
	afterId: ItemId | null;
}

export type Mutation = SelectMutation | DeselectMutation | ReorderMutation;

/** Батч мутаций, применяется по порядку. */
export interface ApplyMutationsRequest {
	ops: Mutation[];
}

export interface ApplyMutationsResponse {
	applied: number;
}
