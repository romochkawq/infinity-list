import type { NextFunction, Request, Response } from 'express';

export function httpLogger(req: Request, res: Response, next: NextFunction): void {
	const start = process.hrtime.bigint();
	res.on('finish', () => {
		const ms = Number(process.hrtime.bigint() - start) / 1e6;
		console.log(
			`${req.method} ${req.originalUrl} ${res.statusCode} +${ms.toFixed(1)}ms`,
		);
	});
	next();
}
