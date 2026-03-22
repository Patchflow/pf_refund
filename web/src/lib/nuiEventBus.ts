type Handler<T = unknown> = (data: T) => void;

const listeners = new Map<string, Set<Handler>>();

export const nuiEventBus = {
	emit(action: string, data: unknown) {
		const handlers = listeners.get(action);
		if (handlers) {
			for (const handler of handlers) {
				handler(data);
			}
		}
	},

	subscribe<T>(action: string, handler: Handler<T>): () => void {
		if (!listeners.has(action)) {
			listeners.set(action, new Set());
		}
		listeners.get(action)?.add(handler as Handler);
		return () => {
			listeners.get(action)?.delete(handler as Handler);
		};
	},
};
