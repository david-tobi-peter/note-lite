import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Note-Lite",
  description: "A minimal, reponsive note taking application",
  icons: {
    icon: "/note-lite.png",
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  }
}

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en">
    <body className={inter.className}>
      {children}
    </body>
  </html>
}