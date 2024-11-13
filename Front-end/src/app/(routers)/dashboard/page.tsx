"use client";
import Footer from "@/components/Footer";
import AccountsProvider from "@/context/account";
import InnovationProvider from "@/context/innovation";
import dynamic from "next/dynamic";
import Dash from "../../../components/Dashboard/Dash"

const NavBar = dynamic(() => import("@/components/NavBar"), {
  ssr: false,
});
export default function Ipsearch() {
  
  return (
      <AccountsProvider>
        <div className="scrollable">
          <NavBar />
          <Dash />
          <Footer />
        </div>
      </AccountsProvider>
  );
}
   
  

