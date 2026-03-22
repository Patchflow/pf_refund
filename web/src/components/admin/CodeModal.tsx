import { Button, Flex, Stack, Text, ThemeIcon } from "@mantine/core";
import { Check, ClipboardCopy } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { useRefundAccent } from "@/hooks/useAccentColor";
import { useLocale } from "@/stores/localeStore";
import { setClipboard } from "@/utils/setClipboard";

interface Props {
	code: string;
	onClose: () => void;
}

export default memo(function CodeModal({ code, onClose }: Props) {
	const [copied, setCopied] = useState(false);
	const accentColor = useRefundAccent();
	const createdTitle = useLocale("code_created_title");
	const createdDesc = useLocale("code_created_desc");
	const copiedTitle = useLocale("code_copied_title");
	const copiedDesc = useLocale("code_copied_desc");
	const copyLabel = useLocale("copy_code");
	const copiedLabel = useLocale("code_copied");
	const doneLabel = useLocale("done");

	const handleCopy = useCallback(() => {
		setClipboard(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2500);
	}, [code]);

	return (
		<Flex
			align="center"
			bg="rgba(0,0,0,0.6)"
			inset={0}
			justify="center"
			pos="absolute"
			style={{ zIndex: 50 }}
		>
			<Flex
				align="center"
				bg="dark.8"
				direction="column"
				gap="lg"
				px="xl"
				py="xl"
				style={{ borderRadius: "var(--mantine-radius-lg)" }}
				w={280}
			>
				<ThemeIcon
					color={copied ? "green" : accentColor}
					radius="xl"
					size={56}
					variant="light"
				>
					{copied ? <Check size={28} /> : <ClipboardCopy size={28} />}
				</ThemeIcon>

				<Stack align="center" gap={4}>
					<Text fw={700} size="md">
						{copied ? copiedTitle : createdTitle}
					</Text>
					<Text c="dimmed" size="xs" ta="center">
						{copied ? copiedDesc : createdDesc}
					</Text>
				</Stack>

				<Stack gap="xs" w="100%">
					<Button
						color={copied ? "green" : accentColor}
						fullWidth
						leftSection={
							copied ? <Check size={16} /> : <ClipboardCopy size={16} />
						}
						onClick={handleCopy}
					>
						{copied ? copiedLabel : copyLabel}
					</Button>
					<Button color="gray" fullWidth onClick={onClose} variant="subtle">
						{doneLabel}
					</Button>
				</Stack>
			</Flex>
		</Flex>
	);
});
