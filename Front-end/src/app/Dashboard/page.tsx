"use client";
import Footer from "@/components/Footer";
import AccountsProvider from "@/context/account";
import InnovationProvider from "@/context/innovation";
// import NavBar from "@/components/NavBar";
import dynamic from "next/dynamic";
import Link from "next/link";
const IPSearch = dynamic(() => import("@/components/search/IPSearch"), {
  ssr: false,
});
const NavBar = dynamic(() => import("@/components/NavBar"), {
  ssr: false,
});
export default function Ipsearch() {
  
  return (
      <AccountsProvider>
        <div className="scrollable">
      
        <Dash />
          <NavBar />
          <Link href={"/search"}>Ip Search</Link>
          <Link href={"/collection"}> Collection</Link>
          <Link href={"/nft"}> Nft</Link>
          <Footer />
        </div>
      </AccountsProvider>
  );
}
   
  

