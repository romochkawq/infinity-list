import { OpenApiGeneratorV3, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import { ErrorCode } from '@infinity/common';

import {
	addItemsSchema,
	applyMutationsSchema,
	availableQuerySchema,
	selectedQuerySchema,
} from '../validation/schemas';

import { z } from './zod';

const cursorPageSchema = z
	.object({
		items: z.array(z.number().int().positive()),
		nextCursor: z.number().int().positive().nullable(),
		hasMore: z.boolean(),
	})
	.openapi('CursorPage');

const offsetPageSchema = z
	.object({
		items: z.array(z.number().int().positive()),
		total: z.number().int().nonnegative(),
		hasMore: z.boolean(),
	})
	.openapi('OffsetPage');

const addItemsResponseSchema = z
	.object({ added: z.array(z.number().int().positive()) })
	.openapi('AddItemsResponse');

const applyMutationsResponseSchema = z
	.object({ applied: z.number().int().nonnegative() })
	.openapi('ApplyMutationsResponse');

const errorResponseSchema = z
	.object({
		statusCode: z.number().int(),
		code: z.nativeEnum(ErrorCode),
		message: z.string(),
	})
	.openapi('ErrorResponse');

export function buildOpenApiDocument(): ReturnType<
	OpenApiGeneratorV3['generateDocument']
> {
	const registry = new OpenAPIRegistry();
	const errorRef = registry.register('ErrorResponse', errorResponseSchema);

	const errorResponses = {
		400: {
			description: 'Validation failed',
			content: { 'application/json': { schema: errorRef } },
		},
		429: {
			description: 'Rate limited',
			content: { 'application/json': { schema: errorRef } },
		},
	};

	registry.registerPath({
		method: 'get',
		path: '/api/items/available',
		summary: 'Левая панель — доступные элементы (курсорная пагинация)',
		request: { query: availableQuerySchema },
		responses: {
			200: {
				description: 'Страница доступных элементов',
				content: { 'application/json': { schema: cursorPageSchema } },
			},
			...errorResponses,
		},
	});

	registry.registerPath({
		method: 'get',
		path: '/api/items/selected',
		summary: 'Правая панель — выбранные элементы (индексная пагинация)',
		request: { query: selectedQuerySchema },
		responses: {
			200: {
				description: 'Страница выбранных элементов',
				content: { 'application/json': { schema: offsetPageSchema } },
			},
			...errorResponses,
		},
	});

	registry.registerPath({
		method: 'post',
		path: '/api/items',
		summary: 'Батч-добавление новых ID (идемпотентно)',
		request: {
			body: {
				content: { 'application/json': { schema: addItemsSchema } },
			},
		},
		responses: {
			201: {
				description: 'Реально добавленные ID',
				content: { 'application/json': { schema: addItemsResponseSchema } },
			},
			...errorResponses,
		},
	});

	registry.registerPath({
		method: 'post',
		path: '/api/selection/mutations',
		summary: 'Батч select/deselect/reorder по порядку',
		request: {
			body: {
				content: { 'application/json': { schema: applyMutationsSchema } },
			},
		},
		responses: {
			200: {
				description: 'Количество применённых операций',
				content: {
					'application/json': { schema: applyMutationsResponseSchema },
				},
			},
			...errorResponses,
		},
	});

	const generator = new OpenApiGeneratorV3(registry.definitions);
	return generator.generateDocument({
		openapi: '3.0.3',
		info: {
			title: 'Infinity List API',
			version: '1.0.0',
			description:
				'Двухпанельный выбор над 1 000 000 элементов с серверным состоянием выбора и порядка.',
		},
		servers: [{ url: '/' }],
	});
}
