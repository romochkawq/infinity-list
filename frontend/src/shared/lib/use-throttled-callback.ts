import { useCallback, useEffect, useRef } from 'react';

export function useThrottledCallback(callback: () => void, delayMs: number): () => void {
	const callbackRef = useRef(callback);
	const lastRun = useRef(0);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(
		() => () => {
			if (timer.current !== null) {
				clearTimeout(timer.current);
			}
		},
		[],
	);

	return useCallback(() => {
		const now = Date.now();
		const elapsed = now - lastRun.current;
		if (elapsed >= delayMs) {
			lastRun.current = now;
			callbackRef.current();
			return;
		}
		if (timer.current === null) {
			timer.current = setTimeout(() => {
				timer.current = null;
				lastRun.current = Date.now();
				callbackRef.current();
			}, delayMs - elapsed);
		}
	}, [delayMs]);
}
