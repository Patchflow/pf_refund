import { isDev } from "./env";

const nativeFetch = window.fetch;

export async function fetchNui<T = void>(
	eventName: string,
	data?: unknown,
): Promise<T | undefined> {
	if (isDev()) return undefined;

	const options = {
		method: "post",
		headers: { "Content-Type": "application/json; charset=UTF-8" },
		body: JSON.stringify(data),
	};

	const resourceName =
		(
			window as unknown as Record<string, (() => string) | undefined>
		).GetParentResourceName?.() ?? "nui-frame-app";

	const resp = await nativeFetch(
		`https://${resourceName}/${eventName}`,
		options,
	);
	const text = await resp.text();
	if (!text) return undefined;

	try {
		return JSON.parse(text) as T;
	} catch {
		return undefined;
	}
}
