import { Vazirmatn } from "next/font/google";

// A softer, Persian-friendly UI font used only inside the /admin panel.
// The public site keeps its own IBM Plex / Noto Kufi Arabic design system —
// this is scoped to admin pages only, not applied globally.
export const adminFont = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-admin",
  display: "swap",
});
