import { create } from "zustand";
import type { CartItem, OxItem } from "@/types";
import { fetchNui } from "@/utils/fetchNui";

interface RefundState {
	visible: boolean;
	items: OxItem[];
	cart: CartItem[];
	search: string;
	maxUses: number;
	expiresIn: string | null;
	generatedCode: string | null;
	imageUrl: string;
	accentColor: string;
	setVisible: (v: boolean) => void;
	setItems: (items: OxItem[]) => void;
	addToCart: (item: OxItem, count: number) => void;
	removeFromCart: (name: string) => void;
	updateCartItemCount: (name: string, count: number) => void;
	updateCartItemMetadata: (
		name: string,
		metadata: Record<string, string>,
	) => void;
	setSearch: (s: string) => void;
	setMaxUses: (n: number) => void;
	setExpiresIn: (v: string | null) => void;
	setGeneratedCode: (code: string | null) => void;
	setImageUrl: (url: string) => void;
	setAccentColor: (color: string) => void;
	createRefund: () => void;

	closeNui: () => void;
	reset: () => void;
}

export const useRefundStore = create<RefundState>((set) => ({
	visible: false,
	items: [],
	cart: [],
	search: "",
	maxUses: 1,
	expiresIn: null,
	generatedCode: null,
	imageUrl: "",
	accentColor: "blue",
	setVisible: (visible) => set({ visible }),
	setItems: (items) => set({ items }),
	addToCart: (item, count) =>
		set((state) => {
			const existing = state.cart.find((c) => c.name === item.name);
			if (existing) {
				return {
					cart: state.cart.map((c) =>
						c.name === item.name ? { ...c, count: c.count + count } : c,
					),
				};
			}
			return {
				cart: [
					...state.cart,
					{
						name: item.name,
						label: item.label,
						image: item.image || `${item.name}.png`,
						count,
						metadata: {},
					},
				],
			};
		}),
	removeFromCart: (name) =>
		set((state) => ({ cart: state.cart.filter((c) => c.name !== name) })),
	updateCartItemCount: (name, count) =>
		set((state) => ({
			cart: state.cart.map((c) =>
				c.name === name ? { ...c, count: Math.max(1, count) } : c,
			),
		})),
	updateCartItemMetadata: (name, metadata) =>
		set((state) => ({
			cart: state.cart.map((c) => (c.name === name ? { ...c, metadata } : c)),
		})),
	setSearch: (search) => set({ search }),
	setMaxUses: (maxUses) => set({ maxUses }),
	setExpiresIn: (expiresIn) => set({ expiresIn }),
	setGeneratedCode: (generatedCode) => set({ generatedCode }),
	setImageUrl: (imageUrl) => set({ imageUrl }),
	setAccentColor: (accentColor) => set({ accentColor }),
	createRefund: () => {
		const { cart, maxUses, expiresIn } = useRefundStore.getState();
		if (cart.length === 0) return;
		const items = cart.map((c) => ({
			name: c.name,
			label: c.label,
			count: c.count,
			metadata: Object.keys(c.metadata).length > 0 ? c.metadata : undefined,
		}));
		fetchNui<string>("CREATE_REFUND", { items, maxUses, expiresIn }).then(
			(code) => {
				if (code) set({ generatedCode: code });
			},
		);
	},
	closeNui: () => {
		fetchNui("CLOSE_NUI");
	},
	reset: () =>
		set({
			visible: false,
			cart: [],
			search: "",
			maxUses: 1,
			expiresIn: null,
			generatedCode: null,
		}),
}));
