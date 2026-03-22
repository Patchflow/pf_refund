import { useHotkeys } from "@mantine/hooks";
import AdminView from "@/components/admin/AdminView";
import ClaimModal from "@/components/claim/ClaimModal";
import { useClaimStore } from "@/stores/claimStore";
import { useRefundStore } from "@/stores/refundStore";
import { fetchNui } from "@/utils/fetchNui";

export default function App() {
	const refundVisible = useRefundStore((s) => s.visible);
	const claimVisible = useClaimStore((s) => s.visible);

	useHotkeys([
		[
			"Escape",
			() => {
				if (refundVisible || claimVisible) {
					fetchNui("CLOSE_NUI");
				}
			},
		],
	]);

	return (
		<>
			<div
				style={{
					visibility: refundVisible ? "visible" : "hidden",
					pointerEvents: refundVisible ? "auto" : "none",
				}}
			>
				<AdminView />
			</div>
			{claimVisible && <ClaimModal />}
		</>
	);
}
