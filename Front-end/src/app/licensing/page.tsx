"use client";
import Licensing from "@/components/Dashboard/Manage/License";
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("@/components/NavBar"), {
  ssr: false,
});

const License = () => {
  return (
    
      <div>
        <NavBar/>
        <Licensing />
      </div>
  );
};

export default License;