import { ActionIcon, Box, Flex, Group, NumberInput, Text } from "@mantine/core";
import { Plus } from "lucide-react";
import { memo, useCallback, useState } from "react";
import ItemImage from "@/components/shared/ItemImage";
import { useRefundAccent } from "@/hooks/useAccentColor";
import { useRefundStore } from "@/stores/refundStore";
import type { OxItem } from "@/types";

export default memo(function ItemCard({ item }: { item: OxItem }) {
	const [count, setCount] = useState(1);
	const addToCart = useRefundStore((s) => s.addToCart);
	const imageUrl = useRefundStore((s) => s.imageUrl);
	const accentColor = useRefundAccent();

	const handleAdd = useCallback(() => {
		addToCart(item, count);
		setCount(1);
	}, [addToCart, item, count]);

	const handleCountChange = useCallback((v: string | number) => {
		setCount(typeof v === "number" ? Math.max(1, v) : 1);
	}, []);

	return (
		<Flex
			align="center"
			bg="dark.8"
			direction="column"
			gap={10}
			pb="sm"
			pt="md"
			px="sm"
			style={{ borderRadius: "var(--mantine-radius-md)" }}
		>
			<Flex opacity={0.9}>
				<ItemImage size={40} src={`${imageUrl}${item.image}`} />
			</Flex>
			<Box w="100%">
				<Text fw={600} lineClamp={1} size="xs" ta="center">
					{item.label}
				</Text>
				<Text c="dimmed" fz={10} lineClamp={1} ta="center">
					{item.name}
				</Text>
			</Box>
			<Group gap={6} w="100%" wrap="nowrap">
				<NumberInput
					flex={1}
					min={1}
					onChange={handleCountChange}
					size="xs"
					value={count}
				/>
				<ActionIcon
					color={accentColor}
					onClick={handleAdd}
					size={32}
					variant="light"
				>
					<Plus size={16} />
				</ActionIcon>
			</Group>
		</Flex>
	);
});
