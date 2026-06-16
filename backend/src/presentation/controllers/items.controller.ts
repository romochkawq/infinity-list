import type { AddItemsResponse, CursorPage, OffsetPage } from '@infinity/common';
import type { RequestHandler } from 'express';

import type { AddItems } from '../../application/add-items';
import type { GetAvailable } from '../../application/get-available';
import type { GetSelected } from '../../application/get-selected';
import { asyncHandler } from '../middleware/async-handler';
import {
	addItemsSchema,
	availableQuerySchema,
	selectedQuerySchema,
} from '../validation/schemas';

export interface ItemsController {
	getAvailable: RequestHandler;
	getSelected: RequestHandler;
	addItems: RequestHandler;
}

export function createItemsController(deps: {
	getAvailable: GetAvailable;
	getSelected: GetSelected;
	addItems: AddItems;
}): ItemsController {
	return {
		getAvailable: asyncHandler(async (req, res) => {
			const query = availableQuerySchema.parse(req.query);
			const page: CursorPage = await deps.getAvailable.execute(query);
			res.json(page);
		}),

		getSelected: asyncHandler(async (req, res) => {
			const query = selectedQuerySchema.parse(req.query);
			const page: OffsetPage = await deps.getSelected.execute(query);
			res.json(page);
		}),

		addItems: asyncHandler(async (req, res) => {
			const body = addItemsSchema.parse(req.body);
			const result: AddItemsResponse = await deps.addItems.execute(body);
			res.status(201).json(result);
		}),
	};
}
