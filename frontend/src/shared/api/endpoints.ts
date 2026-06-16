import type {
	AddItemsRequest,
	AddItemsResponse,
	ApplyMutationsRequest,
	ApplyMutationsResponse,
	CursorPage,
	GetAvailableQuery,
	GetSelectedQuery,
	OffsetPage,
} from '@infinity/common';

import { request } from './http';

export function fetchAvailable(
	query: GetAvailableQuery,
	signal?: AbortSignal,
): Promise<CursorPage> {
	return request<CursorPage>('/items/available', {
		query: { cursor: query.cursor, limit: query.limit, search: query.search },
		signal,
	});
}

export function fetchSelected(
	query: GetSelectedQuery,
	signal?: AbortSignal,
): Promise<OffsetPage> {
	return request<OffsetPage>('/items/selected', {
		query: { offset: query.offset, limit: query.limit, search: query.search },
		signal,
	});
}

export function addItems(body: AddItemsRequest): Promise<AddItemsResponse> {
	return request<AddItemsResponse>('/items', { method: 'POST', body });
}

export function applyMutations(
	body: ApplyMutationsRequest,
): Promise<ApplyMutationsResponse> {
	return request<ApplyMutationsResponse>('/selection/mutations', {
		method: 'POST',
		body,
	});
}
