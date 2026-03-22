import { create } from "zustand";

type Locales = Record<string, string>;

interface LocaleState {
	locales: Locales;
	setLocales: (locales: Locales) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
	locales: {},
	setLocales: (locales) => set({ locales }),
}));

export function useLocale(key: string): string {
	return useLocaleStore((s) => s.locales[key] ?? key);
}
