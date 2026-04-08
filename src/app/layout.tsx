import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedBackground from "@/components/AnimatedBackground";

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thomas Hung — Engineering Portfolio",
  description: "Curiosity everyday. Engineering Physics student specializing in mechanical design, prototyping, and material science.",
  openGraph: {
    title: "Thomas Hung — Engineering Portfolio",
    description: "Curiosity everyday. Engineering Physics student specializing in mechanical design, prototyping, and material science.",
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
    description: "Curiosity everyday. Engineering Physics student specializing in mechanical design, prototyping, and material science.",
    images: ["/images/hero-1.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col selection:bg-primary selection:text-white relative">
        <div 
          className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
        />
        <AnimatedBackground />
        <Header />
        <main className="flex-1 relative z-10 w-full overflow-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
