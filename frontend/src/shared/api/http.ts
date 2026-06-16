import type { ErrorResponse } from '@infinity/common';

import { API_BASE_URL } from '../config/env';

export class ApiError extends Error {
	constructor(
		readonly statusCode: number,
		readonly code: string,
		message: string,
	) {
		super(message);
		this.name = 'ApiError';
	}
}

async function parseError(response: Response): Promise<ApiError> {
	try {
		const body = (await response.json()) as Partial<ErrorResponse>;
		return new ApiError(
			body.statusCode ?? response.status,
			body.code ?? 'UNKNOWN',
			body.message ?? response.statusText,
		);
	} catch {
		return new ApiError(response.status, 'UNKNOWN', response.statusText);
	}
}

interface RequestOptions {
	method?: string;
	query?: Record<string, string | number | undefined>;
	body?: unknown;
	signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions['query']): string {
	const base = API_BASE_URL.startsWith('http')
		? API_BASE_URL
		: `${window.location.origin}${API_BASE_URL}`;
	const url = new URL(`${base}${path}`);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined && value !== '') {
				url.searchParams.set(key, String(value));
			}
		}
	}
	return url.toString();
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const { method = 'GET', query, body, signal } = options;

	const response = await fetch(buildUrl(path, query), {
		method,
		signal,
		headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
		body: body === undefined ? undefined : JSON.stringify(body),
	});

	if (!response.ok) {
		throw await parseError(response);
	}

	return (await response.json()) as T;
}
