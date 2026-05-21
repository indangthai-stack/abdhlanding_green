import type { Metadata, Viewport } from "next";
import { Inter, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { FALLBACK_SITE_CONFIG } from "@/config/fallback";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

const display = Be_Vietnam_Pro({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const cfg = FALLBACK_SITE_CONFIG;

export const metadata: Metadata = {
  metadataBase: new URL(`https://${cfg.domain}`),
  title: {
    default: `${cfg.site_name} — Xưởng áo bóng đá #1 Miền Trung`,
    template: `%s · ${cfg.site_name}`,
  },
  description: cfg.site_tagline,
  applicationName: cfg.site_name,
  keywords: [
    "áo bóng đá huế",
    "in áo team huế",
    "áo bóng đá đặt theo yêu cầu",
    "đồng phục bóng đá fc",
    "áo bóng đá rẻ đẹp huế",
    "CV Steel",
    "Bulbal",
    "Riki",
    "Justplay",
    "AKB",
  ],
  authors: [{ name: cfg.site_name }],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: `https://${cfg.domain}`,
    siteName: cfg.site_name,
    title: `${cfg.site_name} — Báo giá trong 5 phút, giao 5 ngày`,
    description: cfg.site_tagline,
  },
  twitter: {
    card: "summary_large_image",
    title: cfg.site_name,
    description: cfg.site_tagline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#dc4e25",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${inter.variable} ${display.variable}`}>
      <body className="min-h-dvh bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
