import {
	ActionIcon,
	Badge,
	Box,
	Flex,
	Group,
	ScrollArea,
	SimpleGrid,
	Text,
	TextInput,
	Transition,
} from "@mantine/core";
import { PackageOpen, Search, ShoppingCart, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import CartPanel from "@/components/admin/CartPanel";
import ItemCard from "@/components/admin/ItemCard";
import { useRefundAccent } from "@/hooks/useAccentColor";
import { useLocale } from "@/stores/localeStore";
import { useRefundStore } from "@/stores/refundStore";

export default function AdminView() {
	const items = useRefundStore((s) => s.items);
	const search = useRefundStore((s) => s.search);
	const setSearch = useRefundStore((s) => s.setSearch);
	const cartLength = useRefundStore((s) => s.cart.length);
	const closeNui = useRefundStore((s) => s.closeNui);
	const accentColor = useRefundAccent();
	const [cartOpen, setCartOpen] = useState(false);
	const adminTitle = useLocale("admin_title");
	const searchPlaceholder = useLocale("search_placeholder");

	const filtered = useMemo(() => {
		if (!search) return items;
		const q = search.toLowerCase();
		return items.filter(
			(i) =>
				i.label.toLowerCase().includes(q) || i.name.toLowerCase().includes(q),
		);
	}, [items, search]);

	const handleSearchChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			setSearch(e.currentTarget.value),
		[setSearch],
	);

	const toggleCart = useCallback(() => setCartOpen((prev) => !prev), []);
	const closeCart = useCallback(() => setCartOpen(false), []);
	const preventContext = useCallback(
		(e: React.MouseEvent) => e.preventDefault(),
		[],
	);

	return (
		<Flex
			align="center"
			inset={0}
			justify="center"
			onContextMenu={preventContext}
			pos="fixed"
		>
			<Flex
				bd="1px solid var(--mantine-color-dark-6)"
				bg="dark.9"
				direction="column"
				h="75vh"
				pos="relative"
				style={{ borderRadius: "var(--mantine-radius-lg)", overflow: "hidden" }}
				w="65vw"
			>
				<Group
					bd="0 0 1px 0 solid var(--mantine-color-dark-6)"
					gap="sm"
					px="md"
					py="sm"
					wrap="nowrap"
				>
					<Group gap={8} mr="xs" wrap="nowrap">
						<PackageOpen
							color={`var(--mantine-color-${accentColor}-5)`}
							size={18}
						/>
						<Text fw={700} size="sm" truncate>
							{adminTitle}
						</Text>
					</Group>
					<TextInput
						flex={1}
						leftSection={<Search size={14} />}
						onChange={handleSearchChange}
						placeholder={searchPlaceholder}
						size="xs"
						value={search}
					/>
					<Badge
						color={cartLength > 0 ? accentColor : "gray"}
						leftSection={<ShoppingCart size={14} />}
						onClick={toggleCart}
						size="lg"
						style={{ cursor: "pointer" }}
						variant="light"
					>
						{cartLength}
					</Badge>
					<ActionIcon
						color="gray"
						onClick={closeNui}
						size="md"
						variant="subtle"
					>
						<X size={16} />
					</ActionIcon>
				</Group>

				<ScrollArea flex={1} p="md" scrollbarSize={4}>
					<SimpleGrid cols={{ base: 3, sm: 4, md: 5, lg: 7 }} spacing="xs">
						{filtered.map((item) => (
							<ItemCard item={item} key={item.name} />
						))}
					</SimpleGrid>
				</ScrollArea>

				<Transition
					duration={150}
					mounted={cartOpen}
					timingFunction="ease"
					transition="slide-left"
				>
					{(styles) => (
						<Flex inset={0} pos="absolute" style={{ ...styles, zIndex: 10 }}>
							<Box
								flex={1}
								h="100%"
								onClick={closeCart}
								style={{ cursor: "pointer" }}
							/>
							<CartPanel onClose={closeCart} />
						</Flex>
					)}
				</Transition>
			</Flex>
		</Flex>
	);
}
