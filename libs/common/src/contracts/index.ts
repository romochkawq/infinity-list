export type ItemId = number;

export interface CursorPage {
	items: ItemId[];
	nextCursor: ItemId | null;
	hasMore: boolean;
}

export interface OffsetPage {
	items: ItemId[];
	total: number;
	hasMore: boolean;
}

export interface GetAvailableQuery {
	cursor?: ItemId;
	limit?: number;
	search?: string;
}

export interface GetSelectedQuery {
	offset?: number;
	limit?: number;
	search?: string;
}

export interface AddItemsRequest {
	ids: ItemId[];
}

export interface AddItemsResponse {
	added: ItemId[];
}

export type MutationType = 'select' | 'deselect' | 'reorder';

export interface SelectMutation {
	type: 'select';
	itemId: ItemId;
}

export interface DeselectMutation {
	type: 'deselect';
	itemId: ItemId;
}

export interface ReorderMutation {
	type: 'reorder';
	itemId: ItemId;
	afterId: ItemId | null;
}

export type Mutation = SelectMutation | DeselectMutation | ReorderMutation;

export interface ApplyMutationsRequest {
	ops: Mutation[];
}

export interface ApplyMutationsResponse {
	applied: number;
}
