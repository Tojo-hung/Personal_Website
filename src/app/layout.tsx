import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thomas Hung — Engineering Portfolio",
  description: "Hi, I'm Thomas. An engineering physics student at Queen's who builds boats, hydrofoils and the odd tool.",
  openGraph: {
    title: "Thomas Hung — Engineering Portfolio",
    description: "Hi, I'm Thomas. An engineering physics student at Queen's who builds boats, hydrofoils and the odd tool.",
    url: "https://thomashung.dev",
    siteName: "Thomas Hung Portfolio",
    images: [
      {
        url: "/images/hero-1.jpg",
        width: 1200,
        height: 630,
        alt: "Thomas Hung Portfolio Preview Image",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thomas Hung — Engineering Portfolio",
    description: "Hi, I'm Thomas. An engineering physics student at Queen's who builds boats, hydrofoils and the odd tool.",
    images: ["/images/hero-1.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" className={zenKaku.variable}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="w-full flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
