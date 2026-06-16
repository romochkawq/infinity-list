import { createApp } from './app';
import { loadConfig } from './infrastructure/config';

async function bootstrap(): Promise<void> {
	const config = loadConfig();
	const app = createApp(config);

	await new Promise<void>((resolve) => {
		app.listen(config.port, () => {
			console.log(`Backend listening on http://localhost:${config.port}`);
			console.log(`Swagger UI on http://localhost:${config.port}/docs`);
			resolve();
		});
	});
}

bootstrap().catch((error: unknown) => {
	console.error('Failed to start backend:', error);
	process.exit(1);
});
