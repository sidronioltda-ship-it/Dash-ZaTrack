import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { QueryProvider } from "@/components/providers/query-provider";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/top-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZaTrack — Escale no X1 com Precisao",
  description:
    "Sistema avancado de tracking deterministico para campanhas de WhatsApp + Meta Ads + Checkout.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <div className="min-h-screen">
            <DashboardSidebar />
            <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 lg:pl-[320px] lg:pr-6">
              <TopBar />
              {children}
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
