'use client';
import dynamic from "next/dynamic";
const Dash = dynamic(() => import('@/app/components/Dashboard/Dash'), {
  ssr: false,
})

export default function Ipsearch() {
  return (
  <div className="min-[2000px]:w-[1280px]">
  <Dash />
  </div>
  

);
}