"use client";
import Footer from "@/components/Footer";
import AccountsProvider from "@/context/account";
import IpfsProvider from "@/context/ipfs";
import dynamic from "next/dynamic";
const Collection = dynamic(() => import("@/components/collection"), {
  ssr: false,
});
const NavBar = dynamic(() => import("@/components/NavBar"), {
  ssr: false,
});

export default function CollectionPage() {
  return (
    <div className="scrollable ">
      <AccountsProvider>
        <IpfsProvider>
          <NavBar />
          <Collection />
          <Footer />
        </IpfsProvider>
      </AccountsProvider>
    </div>
  );
}
