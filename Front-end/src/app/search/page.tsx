"use client";
import AccountsProvider from "@/context/account";
import InnovationProvider from "@/context/innovation";
// import NavBar from "@/components/NavBar";
import dynamic from "next/dynamic";
const IPSearch = dynamic(() => import("@/components/search/IPSearch"), {
  ssr: false,
});
const NavBar = dynamic(() => import("@/components/NavBar"), {
  ssr: false,
});
export default function Ipsearch() {
  return (
   <InnovationProvider>
     <AccountsProvider>
      <div className="scrollable">
        <NavBar />
        <IPSearch />
      </div>
    </AccountsProvider>
   </InnovationProvider>
  );
}
