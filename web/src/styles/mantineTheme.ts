import type { MantineThemeOverride } from "@mantine/core";
import { DEFAULT_COLORS } from "@/styles/mantineColors";

export const mantineTheme: MantineThemeOverride = {
	colors: DEFAULT_COLORS,
	fontFamily: "Manrope, sans-serif",
	defaultRadius: 6,
	focusRing: "auto",
	components: {
		Input: {
			styles: {
				input: {
					height: 32,
					minHeight: 32,
					backgroundColor: "var(--mantine-color-dark-7)",
					borderRadius: 6,
				},
			},
		},
		Popover: {
			styles: {
				dropdown: {
					backgroundColor: "var(--mantine-color-dark-7)",
				},
			},
		},
		ScrollArea: {
			styles: {
				thumb: {
					backgroundColor: "var(--mantine-color-dark-4)",
				},
			},
		},
		Modal: {
			styles: {
				content: {
					backgroundColor: "var(--mantine-color-dark-8)",
				},
				header: {
					backgroundColor: "var(--mantine-color-dark-8)",
				},
			},
		},
	},
};
