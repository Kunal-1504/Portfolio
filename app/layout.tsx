import { publicPath } from "@/lib/hosting";
import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { CursorBackground } from "@/components/cursor-background";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
const title = "Kunal Deshmukh — AI/ML & Agentic Systems Engineer";
const description =
  "Meet Kunal Deshmukh, an AI/ML Engineer building autonomous agents, computer vision, and production machine learning systems. Explore my work through a conversation.";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title,
  description,
  keywords: [
    "Kunal Deshmukh",
    "AI Engineer",
    "Machine Learning",
    "LangGraph",
    "Computer Vision",
    "Pune",
  ],
  authors: [{ name: "Kunal Deshmukh" }],
  alternates: { canonical: publicPath("/") },
  openGraph: {
    title,
    description,
    type: "website",
    locale: "en_IN",
    images: [{ url: publicPath("/opengraph-image"), width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [publicPath("/opengraph-image")],
  },
  icons: { icon: publicPath("/icon.svg") },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.classList.toggle('dark',localStorage.getItem('theme')==='dark')}catch{}`,
          }}
        />
      </head>
      <body>
        <Providers>
          <CursorBackground />
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <SiteHeader />
          {children}
        </Providers>
      </body>
    </html>
  );
}
