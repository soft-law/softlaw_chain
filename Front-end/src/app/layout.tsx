import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"


export const metadata: Metadata = {
  title: "soft.law",
  description: "The Itellectual Property Chain",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body

      >
        {children}
        <Toaster />
        {/* <Footer/> */}
        
      </body>
    </html>
  );
}
