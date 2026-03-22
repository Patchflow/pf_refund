import { Flex, Image, Text } from "@mantine/core";
import { memo, useCallback, useState } from "react";

interface Props {
	src: string;
	size: number;
}

export default memo(function ItemImage({ src, size }: Props) {
	const [failed, setFailed] = useState(false);
	const onError = useCallback(() => setFailed(true), []);

	return (
		<Flex
			align="center"
			h={size}
			justify="center"
			style={{ flexShrink: 0 }}
			w={size}
		>
			{!failed ? (
				<Image fit="contain" h={size} onError={onError} src={src} w={size} />
			) : (
				<Text c="dimmed" fw={700} size={size > 30 ? "lg" : "sm"}>
					?
				</Text>
			)}
		</Flex>
	);
});
