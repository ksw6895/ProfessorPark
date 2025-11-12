import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Siphon Phenomenon",
  description:
    "An academic deep-dive into the siphon effect in ventricular shunt systems, blending physics, clinical insights, and engineering solutions.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`bg-background ${inter.variable}`}>
      <body className="min-h-screen bg-background font-sans text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
