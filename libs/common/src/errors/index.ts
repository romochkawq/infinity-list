export enum ErrorCode {
	BadRequest = 'BAD_REQUEST',
	NotFound = 'NOT_FOUND',
	Conflict = 'CONFLICT',
	ValidationFailed = 'VALIDATION_FAILED',
	RateLimited = 'RATE_LIMITED',
	Internal = 'INTERNAL_ERROR',
}

export interface ErrorResponse {
	statusCode: number;
	code: ErrorCode;
	message: string;
}
