import { useEffect } from "react";
import { fetchNui } from "@/utils/fetchNui";

export default function ReadyProvider({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	useEffect(() => {
		fetchNui("READY");
	}, []);
	return children;
}
