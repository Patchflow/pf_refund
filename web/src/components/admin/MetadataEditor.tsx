import { ActionIcon, Group, Stack, TextInput } from "@mantine/core";
import { Minus, Plus } from "lucide-react";
import { memo, useCallback } from "react";
import { useRefundAccent } from "@/hooks/useAccentColor";
import { useLocale } from "@/stores/localeStore";

interface Props {
	metadata: Record<string, string>;
	onChange: (metadata: Record<string, string>) => void;
}

export default memo(function MetadataEditor({ metadata, onChange }: Props) {
	const accentColor = useRefundAccent();
	const entries = Object.entries(metadata);
	const keyPlaceholder = useLocale("metadata_key");
	const valuePlaceholder = useLocale("metadata_value");

	const updateKey = useCallback(
		(oldKey: string, newKey: string) => {
			const updated: Record<string, string> = {};
			for (const [k, v] of Object.entries(metadata)) {
				updated[k === oldKey ? newKey : k] = v;
			}
			onChange(updated);
		},
		[metadata, onChange],
	);

	const updateValue = useCallback(
		(key: string, value: string) => {
			onChange({ ...metadata, [key]: value });
		},
		[metadata, onChange],
	);

	const remove = useCallback(
		(key: string) => {
			const updated = { ...metadata };
			delete updated[key];
			onChange(updated);
		},
		[metadata, onChange],
	);

	const add = useCallback(() => {
		let key = "key";
		let i = 1;
		while (metadata[key] !== undefined) {
			key = `key${i++}`;
		}
		onChange({ ...metadata, [key]: "" });
	}, [metadata, onChange]);

	return (
		<Stack gap={4}>
			{entries.map(([key, value]) => (
				<Group gap={4} key={key} wrap="nowrap">
					<TextInput
						flex={1}
						onChange={(e) => updateKey(key, e.currentTarget.value)}
						placeholder={keyPlaceholder}
						size="xs"
						value={key}
					/>
					<TextInput
						flex={1}
						onChange={(e) => updateValue(key, e.currentTarget.value)}
						placeholder={valuePlaceholder}
						size="xs"
						value={value}
					/>
					<ActionIcon
						color="red"
						onClick={() => remove(key)}
						size="xs"
						variant="subtle"
					>
						<Minus size={12} />
					</ActionIcon>
				</Group>
			))}
			<ActionIcon color={accentColor} onClick={add} size="xs" variant="subtle">
				<Plus size={12} />
			</ActionIcon>
		</Stack>
	);
});
