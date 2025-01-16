import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from 'next';
import { RootLayoutClient } from "@/components/layout/root-layout-client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'coLABapes | Collaborate, Create, Innovate',
  description: 'A dynamic platform connecting creators, investors, and collaborators in a single ecosystem.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  );
}