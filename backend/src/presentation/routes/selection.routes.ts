import { Router } from 'express';

import type { SelectionController } from '../controllers/selection.controller';

export function createSelectionRouter(controller: SelectionController): Router {
	const router = Router();
	router.post('/mutations', controller.applyMutations);
	return router;
}
