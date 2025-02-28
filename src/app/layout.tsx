import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./_utils/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daftra App",
  description: "Generated by create next app",
  icons: {
    icon: [
      { url: "/favicon-dark.ico" },
      // { media: "(prefers-color-scheme: light)", url: "/favicon-light.ico" },
      { media: "(prefers-color-scheme: dark)", url: "/favicon-dark.ico" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`min-h-screen w-full ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
