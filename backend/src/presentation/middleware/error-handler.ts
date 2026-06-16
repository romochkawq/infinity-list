import { ErrorCode } from '@infinity/common';
import type { ErrorResponse } from '@infinity/common';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

import { AppError } from '../../domain/errors';

function toResponse(err: unknown): ErrorResponse {
	if (err instanceof AppError) {
		return { statusCode: err.statusCode, code: err.code, message: err.message };
	}
	if (err instanceof ZodError) {
		const message = err.issues
			.map((issue) => `${issue.path.join('.') || '(body)'}: ${issue.message}`)
			.join('; ');
		return { statusCode: 400, code: ErrorCode.ValidationFailed, message };
	}
	return {
		statusCode: 500,
		code: ErrorCode.Internal,
		message: 'Internal server error',
	};
}

export function notFoundHandler(_req: Request, res: Response): void {
	const body: ErrorResponse = {
		statusCode: 404,
		code: ErrorCode.NotFound,
		message: 'Route not found',
	};
	res.status(body.statusCode).json(body);
}

export function errorHandler(
	err: unknown,
	req: Request,
	res: Response,
	_next: NextFunction,
): void {
	const body = toResponse(err);
	if (body.statusCode >= 500) {
		console.error(`[error] ${req.method} ${req.originalUrl}`, err);
	}
	res.status(body.statusCode).json(body);
}
