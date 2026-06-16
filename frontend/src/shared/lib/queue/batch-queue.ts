export interface FlushTimerOptions {
	intervalMs: number;
	flush: () => Promise<void>;
	onError?: (error: unknown) => void;
}

export class FlushTimer {
	private timer: ReturnType<typeof setTimeout> | null = null;
	private running = false;

	constructor(private readonly options: FlushTimerOptions) {}

	schedule(): void {
		if (this.timer !== null || this.running) {
			return;
		}
		this.timer = setTimeout(() => {
			this.timer = null;
			this.fire();
		}, this.options.intervalMs);
	}

	private fire(): void {
		if (this.running) {
			return;
		}
		this.running = true;
		this.options
			.flush()
			.catch((error) => this.options.onError?.(error))
			.finally(() => {
				this.running = false;
			});
	}

	stop(): void {
		if (this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}
}
