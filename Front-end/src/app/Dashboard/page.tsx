'use client';
import NavBar from "@/components/landing/NavBar"
import dynamic from "next/dynamic";
const Dash = dynamic(() => import('@/components/Dashboard/Dash'), {
  ssr: false,
})

export default function Ipsearch() {
  
  return (
    <>
    <div className="min-[2000px]:w-[1280px]">
      <NavBar />
      <Dash />

  </div>

    </>
  
  

);
}