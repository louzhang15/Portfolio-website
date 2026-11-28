import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// self-hosted and preloaded, with a metric-matched fallback, so headings do not re-wrap when the webfont arrives
// optional: the fallback cannot copy Archivo's 125% width, so a late swap would re-wrap titles; a slow first visit keeps the fallback
const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "optional" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  // resolves Open Graph / Twitter image URLs for link previews
  metadataBase: new URL("https://www.louiszhang.app"),
  title: {
    default: "Louis Zhang — Engineering Portfolio",
    template: "%s | Louis Zhang",
  },
  description:
    "Mechanical & software engineering portfolio — projects spanning aerospace, robotics & electronics, and full-stack software. Internships at City of Montreal, Lockheed Martin, and Tesla. Includes a playable driving game version.",
  openGraph: {
    siteName: "Louis Zhang",
    title: "Louis Zhang — Engineering Portfolio",
    description:
      "Aerospace, robotics, and software projects from an engineering student. Internships at Tesla, Lockheed Martin, and City of Montreal. Also a playable game.",
    type: "website",
    url: "/",
    locale: "en_US",
    images: [
      {
        url: "/og-home.png",
        width: 1200,
        height: 630,
        alt: "Louis Zhang — engineering portfolio preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Louis Zhang — Engineering Portfolio",
    description:
      "Aerospace, robotics, and software projects. Internships at Tesla, Lockheed Martin, and City of Montreal.",
    images: ["/og-home.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-[var(--color-background)]">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
