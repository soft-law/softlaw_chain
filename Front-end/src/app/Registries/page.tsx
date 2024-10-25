'use client';
import NavBar from "@/components/NavBar";
import dynamic from "next/dynamic";
const Identity = dynamic(() => import('@/components/IPSearch/IPSearch'), {
  ssr: false,
})

export default function identity () {

  return (
  
  <div className="scrollable min-[2000px]:w-[1280px]">
    <NavBar/>
     <Identity />
  </div>
  

);
}