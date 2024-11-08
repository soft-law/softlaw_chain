"use client";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidhWrapper";
import { useContext } from 'react';
// import { FormDataContext } from "../../ProofOfInnovation/FormDataContext";
// import { useDashboardTapContext } from "@/context/dashboard";
import Footer from "../../Footer"
// import ReusableHeading from "../../ProofOfInnovation/textComponent";
import Image from "next/image";
import Link from "next/link";
import { FormDataContext } from "@/components/FormDataContext";
import { useDashboardContext } from "@/context/dashboard";
import ReusableHeading from "@/components/textComponent";

interface MyProductsProps {
  onDataChange: (data: any) => void;
}



export default function MyProducts ({onDataChange}: MyProductsProps) {

  const {selectedTabDashboard,
    setSelectedTabDashboard} = useDashboardContext()

  const {formData, updateFormData} = useContext(FormDataContext);

  

  return (
    <div className="bg-[#1C1A11] flex flex-col flex-shrink-0 w-full justify-center items-center text-white min-[2000px]:w-[3000px]">
    
      <MaxWidthWrapper className="flex flex-col self-stretch min-[2000px]:min-h-screen pt-[120px] justify-center items-center">
        <div className="flex flex-col w-full justify-items-center gap-[px] pb-[120px]">
          <div className="mb-[60px] border border-b border-[#8A8A8A]">
            <ReusableHeading text="All IPs" />
          </div>
            
            {/* my products section */}
          <div className="flex items-start content-start gap-[60px] self-stretch flex-wrap">

            <Link className="flex h-[403px] min-w-[320px] px-[16px] py-[8px] flex-col justify-center gap-[10px] rounded-[16px] bg-[#27251C]"
            href={"/Innovation"}
            >
              <Image
              width={48}
              height={48}
              src={"/images/AddIP.svg"}
              alt="upload icon"
              />
              <h1 className="text-[#EFF4F6] text-[20px] font-[400] leading-[145%] tracking-[0.4px]">Upload <span className="block">New IP</span></h1>
            </Link>

          </div>

        
        
        </div>
      </MaxWidthWrapper>
      <Footer
        width="py-[60px] max-h-[400px]"
        className="border-t-[1px] border-[#8A8A8A] w-full"
      />
    </div>
  );
}
