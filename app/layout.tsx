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
          <div className="p-3 mt-16 min-h-screen">{children}</div>
          {/* Footer */}
          <footer className="py-12 px-4 bg-secondary/20">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
              <div className="mb-6 md:mb-0">
                <h3 className="font-bold text-xl">
                  Association E-Sport & Digital Universe
                </h3>
                <p className="text-muted-foreground mt-2">
                  © 2025 Tous droits réservés
                </p>
              </div>
              <div className="flex gap-8">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  À propos
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Partenaires
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  FAQ
                </a>
              </div>
            </div>
          </footer>
        </body>
      </SessionProvider>
    </html>
  );
}
