/** Строковые коды ошибок — стабильный контракт между бэком и фронтом. */
export enum ErrorCode {
	BadRequest = 'BAD_REQUEST',
	NotFound = 'NOT_FOUND',
	Conflict = 'CONFLICT',
	ValidationFailed = 'VALIDATION_FAILED',
	RateLimited = 'RATE_LIMITED',
	Internal = 'INTERNAL_ERROR',
}

/** Единый плоский формат ошибки наружу (без утечки внутренних деталей). */
export interface ErrorResponse {
	statusCode: number;
	code: ErrorCode;
	message: string;
}
