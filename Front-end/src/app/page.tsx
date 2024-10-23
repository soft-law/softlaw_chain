
'use client';
import React from "react";
import Hero from "@/components/landing/hero";
import OurServices from "@/components/landing/OurServices";
import UseCase from "@/components/landing/UseCase";
import OurProducts from "@/components/landing/OurProducts/OurProducts";
import Polkadot from "@/components/landing/Polkadot";
import Team from "@/components/landing/Team/Team";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="scrollable ">
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
