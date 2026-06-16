import { z } from 'zod';

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.coerce.number().int().positive().default(3000),
	CORS_ORIGIN: z
		.string()
		.default('http://localhost:5173,http://127.0.0.1:5173'),
	RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
	RATE_LIMIT_MAX: z.coerce.number().int().positive().default(300),
	JSON_BODY_LIMIT: z.string().default('100kb'),
	TRUST_PROXY: z.coerce.number().int().min(0).default(0),
	STATIC_DIR: z.string().optional(),
});

export interface AppConfig {
	nodeEnv: 'development' | 'production' | 'test';
	port: number;
	corsOrigins: string[];
	rateLimit: { windowMs: number; max: number };
	jsonBodyLimit: string;
	trustProxy: number;
	staticDir: string | undefined;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
	const parsed = envSchema.safeParse(env);
	if (!parsed.success) {
		const issues = parsed.error.issues
			.map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
			.join('\n');
		throw new Error(`Invalid environment configuration:\n${issues}`);
	}

	const data = parsed.data;
	return {
		nodeEnv: data.NODE_ENV,
		port: data.PORT,
		corsOrigins: data.CORS_ORIGIN.split(',')
			.map((origin) => origin.trim())
			.filter((origin) => origin.length > 0),
		rateLimit: { windowMs: data.RATE_LIMIT_WINDOW_MS, max: data.RATE_LIMIT_MAX },
		jsonBodyLimit: data.JSON_BODY_LIMIT,
		trustProxy: data.TRUST_PROXY,
		staticDir: data.STATIC_DIR,
	};
}
