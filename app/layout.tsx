import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Navbar from "./_components/nav-bar";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EDU",
  description: "EDU Toulouse Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <SessionProvider>
        <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
          <Navbar />
          <div className="p-3">{children}</div>
        </body>
      </SessionProvider>
    </html>
  );
}
