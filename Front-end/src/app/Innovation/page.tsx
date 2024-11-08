"use client";
import Footer from "@/components/Footer";
import AccountsProvider from "@/context/account";
import InnovationProvider from "@/context/innovation";
import dynamic from "next/dynamic";
// const ProofOfInnovation = dynamic(
//   () => import("@/components/ProofOfInnovation"),
//   {
//     ssr: false,
//   }
// );

const ProofOfInnovation = dynamic(() => import("@/components/innovation"), {
  ssr: false,
});
const NavBar = dynamic(() => import("@/components/NavBar"), {
  ssr: false,
});

export default function DashPage() {
  return (
    <AccountsProvider>
    <InnovationProvider>
     
        <div className="scrollable">
          <NavBar />
          <ProofOfInnovation />
          {/* <Footer /> */}
        </div>

    </InnovationProvider>
    </AccountsProvider>
  );
}
