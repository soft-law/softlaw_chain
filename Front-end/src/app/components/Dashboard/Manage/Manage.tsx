"use client";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/app/components/MaxWidhWrapper";
import { useContext } from 'react';
import { FormDataContext } from "../../ProofOfInnovation/FormDataContext";
import { useDashboardTapContext } from "@/context/dashboard";
import Footer from "../../Footer"
import ReusableHeading from "../../ProofOfInnovation/textComponent";
import Image from "next/image";
import Link from "next/link";
import TypesComponent from "@/app/components/ProofOfInnovation/TypesProps";

interface ManageProps {
  onDataChange: (data: any) => void;
}

export default function Manage ({onDataChange}: ManageProps) {

  const {selectedTabDashboard,
    setSelectedTabDashboard} = useDashboardTapContext()

  const {formData, updateFormData} = useContext(FormDataContext);

  

  return (
    <div className="bg-[#1C1A11] flex flex-col flex-shrink-0 w-full justify-center items-center text-white min-[2000px]:w-[3000px]">
    
      <MaxWidthWrapper className="flex flex-col self-stretch min-[2000px]:min-h-screen pt-[120px] justify-center items-center">
        <div className="flex flex-col w-full gap-[40px] self-stretch items-center p-[16px] border border-[#8A8A8A] rounded-md">
          <div className="flex justify-between items-start self-stretch mb-[60px]">
            <ReusableHeading text="All IPs" />
            <Link className="rounded-[8px] bg-[#373737] justify-center items-center py-[8px] px-[16px] text-[#EFF4F6] text-[16px] font-normal leading-[145%] tracking-[0.32px]"
            href={"/License"}
            >
                Create License
            </Link>
          </div>
            
            {/* my products section */}
          <div className="flex items-start content-start gap-[60px] self-stretch flex-wrap">

           <TypesComponent 
           text="No License created yet"
           />

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
