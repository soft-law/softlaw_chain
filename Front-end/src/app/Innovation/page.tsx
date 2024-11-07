import Footer from "@/components/Footer";
import dynamic from "next/dynamic";
const ProofOfInnovation = dynamic(
  () => import("@/components/ProofOfInnovation"),
  {
    ssr: false,
  }
);
const NavBar = dynamic(() => import("@/components/NavBar"), {
  ssr: false,
});

export default function DashPage() {
  return (
    <div className="">
      <NavBar />
      <ProofOfInnovation />
      <Footer />
    </div>
  );
}
