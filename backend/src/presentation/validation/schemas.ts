import {
	MAX_ADD_BATCH,
	MAX_MUTATION_BATCH,
	MAX_PAGE_LIMIT,
	PAGE_SIZE,
} from '@infinity/common';

import { z } from '../openapi/zod';

const itemId = z
	.number()
	.int()
	.positive()
	.max(Number.MAX_SAFE_INTEGER)
	.openapi({ description: 'Положительный целочисленный идентификатор элемента' });

const search = z
	.string()
	.trim()
	.max(16)
	.optional()
	.openapi({ description: 'Подстрочный фильтр по десятичной записи ID' });

const limit = z.coerce
	.number()
	.int()
	.min(1)
	.max(MAX_PAGE_LIMIT)
	.default(PAGE_SIZE)
	.openapi({ description: `Размер страницы (1..${MAX_PAGE_LIMIT})` });

export const availableQuerySchema = z
	.object({
		cursor: z.coerce.number().int().positive().optional(),
		limit,
		search,
	})
	.openapi('GetAvailableQuery');

export const selectedQuerySchema = z
	.object({
		offset: z.coerce.number().int().min(0).default(0),
		limit,
		search,
	})
	.openapi('GetSelectedQuery');

export const addItemsSchema = z
	.object({
		ids: z.array(itemId).min(1).max(MAX_ADD_BATCH),
	})
	.openapi('AddItemsRequest');

const selectMutationSchema = z.object({
	type: z.literal('select'),
	itemId,
});

const deselectMutationSchema = z.object({
	type: z.literal('deselect'),
	itemId,
});

const reorderMutationSchema = z.object({
	type: z.literal('reorder'),
	itemId,
	afterId: itemId.nullable(),
});

const mutationSchema = z
	.discriminatedUnion('type', [
		selectMutationSchema,
		deselectMutationSchema,
		reorderMutationSchema,
	])
	.openapi('Mutation');

export const applyMutationsSchema = z
	.object({
		ops: z.array(mutationSchema).min(1).max(MAX_MUTATION_BATCH),
	})
	.openapi('ApplyMutationsRequest');
