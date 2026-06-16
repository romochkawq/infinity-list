import type { ApplyMutationsResponse } from '@infinity/common';
import type { RequestHandler } from 'express';

import type { ApplyMutations } from '../../application/apply-mutations';
import { asyncHandler } from '../middleware/async-handler';
import { applyMutationsSchema } from '../validation/schemas';

export interface SelectionController {
	applyMutations: RequestHandler;
}

export function createSelectionController(deps: {
	applyMutations: ApplyMutations;
}): SelectionController {
	return {
		applyMutations: asyncHandler(async (req, res) => {
			const body = applyMutationsSchema.parse(req.body);
			const result: ApplyMutationsResponse =
				await deps.applyMutations.execute(body);
			res.json(result);
		}),
	};
}
