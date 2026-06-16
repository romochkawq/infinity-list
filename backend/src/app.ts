import express from 'express';
import type { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import { AddItems } from './application/add-items';
import { ApplyMutations } from './application/apply-mutations';
import { GetAvailable } from './application/get-available';
import { GetSelected } from './application/get-selected';
import type { StateRepository } from './domain/ports';
import type { AppConfig } from './infrastructure/config';
import { InMemoryRepository } from './infrastructure/in-memory-repository';
import { createItemsController } from './presentation/controllers/items.controller';
import { createSelectionController } from './presentation/controllers/selection.controller';
import { asyncHandler } from './presentation/middleware/async-handler';
import { errorHandler, notFoundHandler } from './presentation/middleware/error-handler';
import { httpLogger } from './presentation/middleware/http-logger';
import { securityMiddleware } from './presentation/middleware/security';
import { buildOpenApiDocument } from './presentation/openapi/registry';
import { createItemsRouter } from './presentation/routes/items.routes';
import { createSelectionRouter } from './presentation/routes/selection.routes';

export function createApp(
	config: AppConfig,
	repository: StateRepository = new InMemoryRepository(),
): Express {
	const getAvailable = new GetAvailable(repository);
	const getSelected = new GetSelected(repository);
	const addItems = new AddItems(repository);
	const applyMutations = new ApplyMutations(repository);

	const itemsController = createItemsController({
		getAvailable,
		getSelected,
		addItems,
	});
	const selectionController = createSelectionController({ applyMutations });

	const app = express();
	app.disable('x-powered-by');
	app.use(...securityMiddleware(config));
	app.use(express.json({ limit: config.jsonBodyLimit }));
	app.use(httpLogger);

	app.get('/health', (_req, res) => {
		res.json({ status: 'ok' });
	});

	const openApiDocument = buildOpenApiDocument();
	app.get(
		'/docs/openapi.json',
		asyncHandler(async (_req, res) => {
			res.json(openApiDocument);
		}),
	);
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

	app.use('/api/items', createItemsRouter(itemsController));
	app.use('/api/selection', createSelectionRouter(selectionController));

	app.use(notFoundHandler);
	app.use(errorHandler);

	return app;
}
