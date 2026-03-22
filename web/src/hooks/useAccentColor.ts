import type { MantineColor } from "@mantine/core";
import { useClaimStore } from "@/stores/claimStore";
import { useRefundStore } from "@/stores/refundStore";

function resolve(color: string): MantineColor {
	if (color.startsWith("#")) return color;
	return color as MantineColor;
}

export function useRefundAccent(): MantineColor {
	return resolve(useRefundStore((s) => s.accentColor));
}

export function useClaimAccent(): MantineColor {
	return resolve(useClaimStore((s) => s.accentColor));
}
