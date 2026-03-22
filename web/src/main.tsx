import { createRoot } from "react-dom/client";
import Root from "@/app/Root";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(<Root />);
