
'use client';
import React from "react";
import Hero from "@/app/components/landing/hero";
import OurServices from "@/app/components/landing/OurServices";
import UseCase from "@/app/components/landing/UseCase";
import OurProducts from "@/app/components/landing/OurProducts/OurProducts";
import Polkadot from "@/app/components/landing/Polkadot";
import Team from "@/app/components/landing/Team/Team";
import Footer from "@/app/components/Footer";
// import NavBar from "@/components/NavBar";

import dynamic from "next/dynamic";
const NavBar = dynamic(
  () => import("@/app/components/NavBar"),
  {
    ssr: false,
  }
);
export default function Home() {
  return (
    <div className="scrollable ">
      <NavBar />
      <Hero />
      <OurServices />
      <UseCase />
      <OurProducts />
      <Polkadot />
      <Team />
      <Footer />
    </div>
  );
}
