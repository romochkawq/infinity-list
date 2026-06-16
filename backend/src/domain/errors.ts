import { ErrorCode } from '@infinity/common';

export class AppError extends Error {
	constructor(
		readonly code: ErrorCode,
		message: string,
		readonly statusCode: number,
	) {
		super(message);
		this.name = 'AppError';
	}
}

export const badRequest = (message: string): AppError =>
	new AppError(ErrorCode.BadRequest, message, 400);

export const notFound = (message: string): AppError =>
	new AppError(ErrorCode.NotFound, message, 404);

export const conflict = (message: string): AppError =>
	new AppError(ErrorCode.Conflict, message, 409);
