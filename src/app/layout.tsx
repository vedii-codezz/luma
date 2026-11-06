import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUMA | AI Study Workspace",
  description: "LUMA identifies what you still do not understand. Upload notes, track concept mastery, and diagnose weak topics with precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-screen bg-[#202720] text-[#F2F3EF] antialiased selection:bg-[#9AF59E]/20 selection:text-[#F2F3EF]">
        {children}
      </body>
    </html>
  );
}
