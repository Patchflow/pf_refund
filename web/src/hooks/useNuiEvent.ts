import { useEffect, useRef } from "react";
import { nuiEventBus } from "@/lib/nuiEventBus";

type NuiHandlerSignature<T> = (data: T) => void;

const noop = () => {};

export function useNuiEvent<T = unknown>(
	action: string,
	handler: (data: T) => void,
) {
	const savedHandler = useRef<NuiHandlerSignature<T>>(noop);

	useEffect(() => {
		savedHandler.current = handler;
	}, [handler]);

	useEffect(() => {
		return nuiEventBus.subscribe<T>(action, (data) => {
			savedHandler.current(data);
		});
	}, [action]);
}
