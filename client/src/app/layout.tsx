import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/contexts/WalletContext";
import { JobProvider } from "@/contexts/JobContext";
import { DisputeProvider } from "@/contexts/DisputeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stellar Escrow - Decentralized Freelance Marketplace",
  description: "Secure escrow platform for freelance work on Stellar blockchain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WalletProvider>
          <JobProvider>
            <DisputeProvider>
              {children}
            </DisputeProvider>
          </JobProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
