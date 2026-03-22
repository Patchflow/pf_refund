import "@/styles/globals.css";
import "@mantine/core/styles.css";

import { MantineProvider } from "@mantine/core";
import App from "@/app/App";
import MessageEventProvider from "@/providers/MessageEventProvider";
import ReadyProvider from "@/providers/ReadyProvider";
import { mantineTheme } from "@/styles/mantineTheme";

export default function Root() {
	return (
		<MantineProvider
			defaultColorScheme="dark"
			forceColorScheme="dark"
			theme={mantineTheme}
		>
			<MessageEventProvider>
				<ReadyProvider>
					<App />
				</ReadyProvider>
			</MessageEventProvider>
		</MantineProvider>
	);
}
