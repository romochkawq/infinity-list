import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadEnv } from 'dotenv';

import { createApp } from './app';
import { loadConfig } from './infrastructure/config';

loadEnv({ path: resolvePath(dirname(fileURLToPath(import.meta.url)), '../../.env') });

async function bootstrap(): Promise<number> {
	const config = loadConfig();
	const app = createApp(config);

	return new Promise<number>(resolve => {
		app.listen(config.port, () => resolve(config.port));
	});
}

bootstrap().then((port) => {
	console.log(`Backend listening on http://localhost:${port}`);
	console.log(`Swagger UI on http://localhost:${port}/docs`);
}).catch(e => {
	console.error('Failed to start backend:', e);
	process.exit(1);
});
