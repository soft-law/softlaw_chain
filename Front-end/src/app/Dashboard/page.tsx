"use client";
import Footer from "@/components/Footer";
import AccountsProvider from "@/context/account";
import InnovationProvider from "@/context/innovation";
// import NavBar from "@/components/NavBar";
import dynamic from "next/dynamic";
import Link from "next/link";
import Dash from "../../components/Dashboard/Dash"

const NavBar = dynamic(() => import("@/components/NavBar"), {
  ssr: false,
});
export default function Ipsearch() {
  
  return (
      <AccountsProvider>
        <div className="scrollable">
          <NavBar />
          <Dash />
          <Link href={"/search"}>Ip Search</Link>
          <Link href={"/collection"}> Collection</Link>
          <Link href={"/nft"}> Nft</Link>
          <Footer />
        </div>
      </AccountsProvider>
  );
}
   
  

