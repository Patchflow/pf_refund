import {
	ActionIcon,
	Box,
	Collapse,
	Group,
	NumberInput,
	Text,
	Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FileText, Trash2 } from "lucide-react";
import { memo, useCallback } from "react";
import MetadataEditor from "@/components/admin/MetadataEditor";
import ItemImage from "@/components/shared/ItemImage";
import { useLocale } from "@/stores/localeStore";
import { useRefundStore } from "@/stores/refundStore";
import type { CartItem as CartItemType } from "@/types";

const TOOLTIP_STYLES = {
	tooltip: {
		backgroundColor: "var(--mantine-color-dark-7)",
		color: "var(--mantine-color-dark-1)",
	},
};

export default memo(function CartItem({ item }: { item: CartItemType }) {
	const [metaOpen, { toggle }] = useDisclosure(false);
	const imageUrl = useRefundStore((s) => s.imageUrl);
	const updateCount = useRefundStore((s) => s.updateCartItemCount);
	const updateMetadata = useRefundStore((s) => s.updateCartItemMetadata);
	const removeFromCart = useRefundStore((s) => s.removeFromCart);
	const tooltipMeta = useLocale("tooltip_metadata");
	const tooltipRemove = useLocale("tooltip_remove");

	const handleCountChange = useCallback(
		(v: string | number) =>
			updateCount(item.name, typeof v === "number" ? v : 1),
		[updateCount, item.name],
	);

	const handleRemove = useCallback(
		() => removeFromCart(item.name),
		[removeFromCart, item.name],
	);

	const handleMetadataChange = useCallback(
		(m: Record<string, string>) => updateMetadata(item.name, m),
		[updateMetadata, item.name],
	);

	return (
		<Box
			bg="dark.7"
			p="xs"
			style={{ borderRadius: "var(--mantine-radius-md)" }}
		>
			<Group gap="xs" wrap="nowrap">
				<ItemImage size={28} src={`${imageUrl}${item.image}`} />
				<Text flex={1} fw={500} lineClamp={1} miw={0} size="xs">
					{item.label}
				</Text>
				<NumberInput
					min={1}
					onChange={handleCountChange}
					size="xs"
					value={item.count}
					w={64}
				/>
				<Tooltip label={tooltipMeta} openDelay={400} styles={TOOLTIP_STYLES}>
					<ActionIcon color="gray" onClick={toggle} size={32} variant="subtle">
						<FileText size={16} />
					</ActionIcon>
				</Tooltip>
				<Tooltip label={tooltipRemove} openDelay={400} styles={TOOLTIP_STYLES}>
					<ActionIcon
						color="red"
						onClick={handleRemove}
						size={32}
						variant="subtle"
					>
						<Trash2 size={16} />
					</ActionIcon>
				</Tooltip>
			</Group>
			<Collapse in={metaOpen}>
				<Box mt="xs" pl={36}>
					<MetadataEditor
						metadata={item.metadata}
						onChange={handleMetadataChange}
					/>
				</Box>
			</Collapse>
		</Box>
	);
});
