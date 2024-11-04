import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
// import NavBar from "@/components/NavBar";
import { Toaster } from "@/components/ui/toaster"
// import Footer from "@/components/Footer";


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
        {/* <NavBar/> */}
        {children}
        <Toaster />
        {/* <Footer/> */}
        
      </body>
    </html>
  );
}
