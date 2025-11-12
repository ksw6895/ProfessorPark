import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "사이펀 현상 (The Siphon Phenomenon)",
  description:
    "뇌실 션트 시스템의 사이펀 효과(siphon effect)에 대한 학술적 심층 분석. 물리학, 임상적 통찰, 공학적 해결책을 통합적으로 다룹니다.",
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
