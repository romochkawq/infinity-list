import { MAX_PAGE_LIMIT, PAGE_SIZE } from '@infinity/common';

/** Защитный клампинг limit в [1, MAX_PAGE_LIMIT] с дефолтом PAGE_SIZE. */
export function clampLimit(limit: number | undefined): number {
	if (limit === undefined || !Number.isFinite(limit)) {
		return PAGE_SIZE;
	}
	return Math.min(Math.max(Math.trunc(limit), 1), MAX_PAGE_LIMIT);
}

/** Неотрицательный целочисленный offset (дефолт 0). */
export function clampOffset(offset: number | undefined): number {
	if (offset === undefined || !Number.isFinite(offset)) {
		return 0;
	}
	return Math.max(Math.trunc(offset), 0);
}
