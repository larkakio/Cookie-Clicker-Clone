import type { Metadata } from "next";
import { DM_Sans, Orbitron } from "next/font/google";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { Providers } from "@/components/providers";
import { BASE_APP_ID, SITE_URL } from "@/lib/env/public";
import { config } from "@/lib/wagmi/config";
import "./globals.css";

const display = Orbitron({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

const ui = DM_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Neon Cookie Core",
  description: "Cyberpunk idle baker — swipe the core on Base.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Neon Cookie Core",
    description: "Cyberpunk idle baker — swipe the core on Base.",
    images: ["/app-thumbnail.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookie = (await headers()).get("cookie");
  const initialState = cookieToInitialState(config, cookie);

  return (
    <html
      lang="en"
      className={`${display.variable} ${ui.variable} h-full antialiased`}
    >
      <head>
        <meta name="base:app_id" content={BASE_APP_ID} />
      </head>
      <body className="min-h-full bg-[#050508] font-[family-name:var(--font-ui)] text-zinc-100">
        <Providers initialState={initialState}>{children}</Providers>
      </body>
    </html>
  );
}
