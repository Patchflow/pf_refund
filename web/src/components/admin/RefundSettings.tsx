import { Group, NumberInput, Select, Stack } from "@mantine/core";
import { memo, useCallback, useMemo } from "react";
import { useLocale } from "@/stores/localeStore";
import { useRefundStore } from "@/stores/refundStore";

const KNOWN_DURATIONS = ["1h", "6h", "12h", "24h", "48h", "7d"];

export default memo(function RefundSettings() {
	const maxUses = useRefundStore((s) => s.maxUses);
	const setMaxUses = useRefundStore((s) => s.setMaxUses);
	const expiresIn = useRefundStore((s) => s.expiresIn);
	const setExpiresIn = useRefundStore((s) => s.setExpiresIn);
	const expiryLabel = useLocale("expiry_label");
	const expiryNone = useLocale("expiry_none");
	const expiry1h = useLocale("expiry_1h");
	const expiry6h = useLocale("expiry_6h");
	const expiry12h = useLocale("expiry_12h");
	const expiry24h = useLocale("expiry_24h");
	const expiry48h = useLocale("expiry_48h");
	const expiry7d = useLocale("expiry_7d");
	const expiryCustom = useLocale("expiry_custom");
	const expiryCustomLabel = useLocale("expiry_custom_label");
	const maxUsesLabel = useLocale("max_uses_label");

	const expiryOptions = useMemo(
		() => [
			{ value: "", label: expiryNone },
			{ value: "1h", label: expiry1h },
			{ value: "6h", label: expiry6h },
			{ value: "12h", label: expiry12h },
			{ value: "24h", label: expiry24h },
			{ value: "48h", label: expiry48h },
			{ value: "7d", label: expiry7d },
			{ value: "custom", label: expiryCustom },
		],
		[
			expiryNone,
			expiry1h,
			expiry6h,
			expiry12h,
			expiry24h,
			expiry48h,
			expiry7d,
			expiryCustom,
		],
	);

	const isCustom = expiresIn !== null && !KNOWN_DURATIONS.includes(expiresIn);

	const handleExpiryChange = useCallback(
		(v: string | null) => {
			if (v === "" || v === null) setExpiresIn(null);
			else if (v === "custom") setExpiresIn("3600");
			else setExpiresIn(v);
		},
		[setExpiresIn],
	);

	const handleMaxUsesChange = useCallback(
		(v: string | number) =>
			setMaxUses(typeof v === "number" ? Math.max(0, v) : 0),
		[setMaxUses],
	);

	const handleCustomExpiryChange = useCallback(
		(v: string | number) =>
			setExpiresIn(typeof v === "number" && v > 0 ? String(v * 60) : "3600"),
		[setExpiresIn],
	);

	return (
		<Stack gap="xs">
			<Group gap="sm" grow>
				<Select
					data={expiryOptions}
					label={expiryLabel}
					onChange={handleExpiryChange}
					size="xs"
					value={isCustom ? "custom" : (expiresIn ?? "")}
				/>
				<NumberInput
					label={maxUsesLabel}
					min={0}
					onChange={handleMaxUsesChange}
					size="xs"
					value={maxUses}
				/>
			</Group>
			{isCustom && (
				<NumberInput
					label={expiryCustomLabel}
					min={1}
					onChange={handleCustomExpiryChange}
					size="xs"
					value={Math.floor(Number(expiresIn) / 60)}
				/>
			)}
		</Stack>
	);
});
