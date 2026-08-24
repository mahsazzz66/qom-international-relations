import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Serif, IBM_Plex_Mono, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import BackToTop from "@/components/BackToTop";

const plexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});
const plexSerif = IBM_Plex_Serif({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
});
const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});
const notoKufi = Noto_Kufi_Arabic({
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-noto-kufi",
  display: "swap",
});
export const metadata: Metadata = {
  title: "International Relations & Communications — Qom Municipality",
  description:
    "Official international gateway of Qom Municipality: urban diplomacy, the Pilgrimage Cities Working Group, international cooperation, events and investment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable} ${notoKufi.variable}`}>
      <body className="bg-bg dark:bg-dark-bg font-sans text-navy dark:text-dark-ink antialiased" style={{ overflowX: "clip" }}>
        <ThemeProvider>
          <LocaleProvider>
            <SiteHeader />
            {children}
            <BackToTop />
            <SiteFooter />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
