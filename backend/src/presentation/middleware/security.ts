import { ErrorCode } from '@infinity/common';
import type { ErrorResponse } from '@infinity/common';
import cors from 'cors';
import type { RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import type { AppConfig } from '../../infrastructure/config';

export function securityMiddleware(config: AppConfig): RequestHandler[] {
	const rateLimited: ErrorResponse = {
		statusCode: 429,
		code: ErrorCode.RateLimited,
		message: 'Too many requests',
	};

	return [
		helmet(),
		cors({ origin: config.corsOrigins, credentials: false }),
		rateLimit({
			windowMs: config.rateLimit.windowMs,
			max: config.rateLimit.max,
			standardHeaders: true,
			legacyHeaders: false,
			handler: (_req, res) => {
				res.status(rateLimited.statusCode).json(rateLimited);
			},
		}),
	];
}
