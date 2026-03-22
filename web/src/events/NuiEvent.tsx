import { useNuiEvent } from "@/hooks/useNuiEvent";
import { useClaimStore } from "@/stores/claimStore";
import { useLocaleStore } from "@/stores/localeStore";
import { useRefundStore } from "@/stores/refundStore";
import type { ClaimItem, OxItem } from "@/types";

interface InitPayload {
	items: OxItem[];
	imageUrl: string;
	accentColor: string;
	locales: Record<string, string>;
}

interface ClaimPayload {
	items: ClaimItem[];
	code: string;
	imageUrl: string;
	accentColor: string;
}

export default function NuiEvent() {
	useNuiEvent<InitPayload>("INIT", (data) => {
		useRefundStore.setState({
			items: data.items,
			imageUrl: data.imageUrl,
			accentColor: data.accentColor,
		});
		if (data.locales) useLocaleStore.setState({ locales: data.locales });
	});

	useNuiEvent<{ locales: Record<string, string> }>("SET_LOCALES", (data) => {
		useLocaleStore.setState({ locales: data.locales });
	});

	useNuiEvent("OPEN_ADMIN", () => {
		useRefundStore.getState().reset();
		useRefundStore.setState({ visible: true });
	});

	useNuiEvent<ClaimPayload>("OPEN_CLAIM", (data) => {
		useClaimStore.setState({
			visible: true,
			items: data.items,
			code: data.code,
			imageUrl: data.imageUrl,
			accentColor: data.accentColor,
		});
	});

	useNuiEvent("CLOSE", () => {
		useRefundStore.getState().reset();
		useClaimStore.getState().reset();
	});

	return null;
}
