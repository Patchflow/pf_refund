import {
	ActionIcon,
	Button,
	Divider,
	Flex,
	Group,
	ScrollArea,
	Stack,
	Text,
} from "@mantine/core";
import { ShoppingCart, X } from "lucide-react";
import { memo, useCallback } from "react";
import CartItem from "@/components/admin/CartItem";
import CodeModal from "@/components/admin/CodeModal";
import RefundSettings from "@/components/admin/RefundSettings";
import { useRefundAccent } from "@/hooks/useAccentColor";
import { useLocale } from "@/stores/localeStore";
import { useRefundStore } from "@/stores/refundStore";

export default memo(function CartPanel({ onClose }: { onClose: () => void }) {
	const cart = useRefundStore((s) => s.cart);
	const generatedCode = useRefundStore((s) => s.generatedCode);
	const createRefund = useRefundStore((s) => s.createRefund);
	const setGeneratedCode = useRefundStore((s) => s.setGeneratedCode);
	const accentColor = useRefundAccent();
	const cartTitle = useLocale("cart_title");
	const cartEmpty = useLocale("cart_empty");
	const createRefundLabel = useLocale("create_refund");
	const cartItem = useLocale("cart_item");
	const cartItems = useLocale("cart_items");

	const handleCloseCode = useCallback(
		() => setGeneratedCode(null),
		[setGeneratedCode],
	);

	return (
		<Flex bg="dark.8" direction="column" h="100%" pos="relative" w={360}>
			<Group gap="xs" px="md" py="sm" wrap="nowrap">
				<ShoppingCart color="var(--mantine-color-dark-2)" size={16} />
				<Text flex={1} fw={600} size="sm">
					{cartTitle}
				</Text>
				<Text c="dimmed" fw={500} size="xs">
					{cart.length} {cart.length === 1 ? cartItem : cartItems}
				</Text>
				<ActionIcon color="gray" onClick={onClose} size="sm" variant="subtle">
					<X size={14} />
				</ActionIcon>
			</Group>

			<Divider color="dark.6" />

			<ScrollArea flex={1} px="sm" py="sm" scrollbarSize={4}>
				<Stack gap={6}>
					{cart.map((item) => (
						<CartItem item={item} key={item.name} />
					))}
					{cart.length === 0 && (
						<Flex
							align="center"
							direction="column"
							gap="xs"
							opacity={0.4}
							py="xl"
						>
							<ShoppingCart size={32} />
							<Text fw={500} size="xs">
								{cartEmpty}
							</Text>
						</Flex>
					)}
				</Stack>
			</ScrollArea>

			<Stack
				bd="1px 0 0 0 solid var(--mantine-color-dark-6)"
				gap="xs"
				pb="md"
				pt="sm"
				px="md"
			>
				<RefundSettings />
				<Button
					color={accentColor}
					disabled={cart.length === 0}
					fullWidth
					onClick={createRefund}
					size="sm"
				>
					{createRefundLabel}
				</Button>
			</Stack>

			{generatedCode && (
				<CodeModal code={generatedCode} onClose={handleCloseCode} />
			)}
		</Flex>
	);
});
