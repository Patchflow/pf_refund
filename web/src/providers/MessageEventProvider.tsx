import { useEffect } from "react";
import NuiEvent from "@/events/NuiEvent";
import { nuiEventBus } from "@/lib/nuiEventBus";

interface NuiMessageData {
	action: string;
	data: unknown;
}

export default function MessageEventProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	useEffect(() => {
		const handler = (event: MessageEvent<NuiMessageData>) => {
			const { action, data } = event.data;
			if (action) nuiEventBus.emit(action, data);
		};
		window.addEventListener("message", handler);
		return () => window.removeEventListener("message", handler);
	}, []);

	return (
		<>
			<NuiEvent />
			{children}
		</>
	);
}
