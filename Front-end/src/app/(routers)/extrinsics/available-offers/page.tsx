"use client";
import AcceptLicense from "@/components/Extrinsics/acceptLicense";
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("@/components/NavBar"), {
  ssr: false,
});
export default function AvailableOffers() {
  return (
    <div className="scrollable bg-[#1C1A11] ">
      <NavBar />
      <AcceptLicense />
    </div>
  );
}
