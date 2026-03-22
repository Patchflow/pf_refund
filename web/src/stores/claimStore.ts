import { create } from "zustand";
import type { ClaimItem } from "@/types";
import { fetchNui } from "@/utils/fetchNui";

interface ClaimState {
	visible: boolean;
	code: string;
	items: ClaimItem[];
	imageUrl: string;
	accentColor: string;
	setVisible: (v: boolean) => void;
	setCode: (code: string) => void;
	setItems: (items: ClaimItem[]) => void;
	setImageUrl: (url: string) => void;
	setAccentColor: (color: string) => void;
	confirmClaim: () => void;
	cancel: () => void;
	reset: () => void;
}

const INITIAL_STATE = {
	visible: false,
	code: "",
	items: [] as ClaimItem[],
	imageUrl: "",
	accentColor: "blue",
};

export const useClaimStore = create<ClaimState>((set, get) => ({
	...INITIAL_STATE,
	setVisible: (visible) => set({ visible }),
	setCode: (code) => set({ code }),
	setItems: (items) => set({ items }),
	setImageUrl: (imageUrl) => set({ imageUrl }),
	setAccentColor: (accentColor) => set({ accentColor }),
	confirmClaim: () => {
		fetchNui("CONFIRM_CLAIM", { code: get().code });
	},
	cancel: () => {
		fetchNui("CLOSE_NUI");
		set(INITIAL_STATE);
	},
	reset: () => set(INITIAL_STATE),
}));
