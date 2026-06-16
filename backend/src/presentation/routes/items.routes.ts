import { Router } from 'express';

import type { ItemsController } from '../controllers/items.controller';

export function createItemsRouter(controller: ItemsController): Router {
	const router = Router();
	router.get('/available', controller.getAvailable);
	router.get('/selected', controller.getSelected);
	router.post('/', controller.addItems);
	return router;
}
