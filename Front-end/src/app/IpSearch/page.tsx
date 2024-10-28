'use client';
// import NavBar from "@/components/NavBar";
import dynamic from "next/dynamic";
const IPSearch = dynamic(() => import('@/components/IPSearch/IPSearch'), {
  ssr: false,
})
const NavBar = dynamic(
  () => import("@/components/NavBar"),
  {
    ssr: false,
  }
);
export default function Ipsearch() {
  return (
  <div className="min-[2000px]:w-[1280px]">
    <NavBar/>
  {/* <IPSearch /> */}
  </div>
  

);
}