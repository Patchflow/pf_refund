import {
	Button,
	Divider,
	Flex,
	Group,
	ScrollArea,
	Stack,
	Text,
} from "@mantine/core";
import { memo } from "react";
import ItemImage from "@/components/shared/ItemImage";
import { useClaimAccent } from "@/hooks/useAccentColor";
import { useClaimStore } from "@/stores/claimStore";
import { useLocale } from "@/stores/localeStore";
import type { ClaimItem as ClaimItemType } from "@/types";

const ClaimItemRow = memo(function ClaimItemRow({
	item,
	imageUrl,
}: {
	item: ClaimItemType;
	imageUrl: string;
}) {
	const imgSrc = `${imageUrl}${item.image || `${item.name}.png`}`;

	return (
		<Group
			bg="dark.8"
			gap="sm"
			px="sm"
			py="xs"
			style={{ borderRadius: "var(--mantine-radius-md)" }}
			wrap="nowrap"
		>
			<ItemImage size={32} src={imgSrc} />
			<Text flex={1} fw={500} lineClamp={1} miw={0} size="xs">
				{item.label}
			</Text>
			<Text c="dimmed" fw={600} size="xs">
				x{item.count}
			</Text>
		</Group>
	);
});

export default memo(function ClaimModal() {
	const items = useClaimStore((s) => s.items);
	const imageUrl = useClaimStore((s) => s.imageUrl);
	const confirmClaim = useClaimStore((s) => s.confirmClaim);
	const cancel = useClaimStore((s) => s.cancel);
	const accentColor = useClaimAccent();
	const claimTitle = useLocale("claim_title");
	const claimDesc = useLocale("claim_desc");
	const claimConfirm = useLocale("claim_confirm");
	const claimCancel = useLocale("claim_cancel");

	return (
		<Flex align="center" inset={0} justify="center" pos="fixed">
			<Flex
				bd="1px solid var(--mantine-color-dark-6)"
				bg="dark.9"
				direction="column"
				mah="75vh"
				style={{ borderRadius: "var(--mantine-radius-lg)", overflow: "hidden" }}
				w={380}
			>
				<Stack gap={4} pb="sm" pt="lg" px="lg" style={{ flexShrink: 0 }}>
					<Text fw={700} size="md" ta="center">
						{claimTitle}
					</Text>
					<Text c="dimmed" size="xs" ta="center">
						{claimDesc}
					</Text>
				</Stack>

				<Divider color="dark.6" />

				<ScrollArea flex={1} px="sm" py="sm" scrollbarSize={4}>
					<Stack gap={6}>
						{items.map((item) => (
							<ClaimItemRow imageUrl={imageUrl} item={item} key={item.name} />
						))}
					</Stack>
				</ScrollArea>

				<Divider color="dark.6" />

				<Group
					gap="sm"
					justify="center"
					px="lg"
					py="sm"
					style={{ flexShrink: 0 }}
				>
					<Button color={accentColor} onClick={confirmClaim} size="sm">
						{claimConfirm}
					</Button>
					<Button color="gray" onClick={cancel} size="sm" variant="subtle">
						{claimCancel}
					</Button>
				</Group>
			</Flex>
		</Flex>
	);
});
