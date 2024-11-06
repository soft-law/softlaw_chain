"use client";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/app/components/MaxWidhWrapper";
import { useContext } from "react";
import { FormDataContext } from "../../ProofOfInnovation/FormDataContext";
import { useDashboardTapContext } from "@/context/dashboard";
import Footer from "../../Footer";
import ReusableHeading from "../../ProofOfInnovation/textComponent";
import Image from "next/image";
import Link from "next/link";
import TypesComponent from "@/app/components/ProofOfInnovation/TypesProps";
import Searchfilter from "../Searchfilter";

interface LicenseProps {
  onDataChange: (data: any) => void;
}

export default function License({ onDataChange }: LicenseProps) {
  const { selectedTabDashboard, setSelectedTabDashboard } =
    useDashboardTapContext();

  const { formData, updateFormData } = useContext(FormDataContext);

  return (
    <div className="bg-[#1C1A11] flex flex-col flex-shrink-0 w-full justify-center items-center text-white min-[2000px]:w-[3000px]">
      <MaxWidthWrapper className="flex flex-col self-stretch min-[2000px]:min-h-screen pt-[120px] justify-center items-center">
        <div className="flex flex-col w-full gap-[40px] self-stretch items-center p-[16px] border border-[#8A8A8A] rounded-md">
          <div className="flex items-start self-stretch mb-[60px]">
            <ReusableHeading
              text={`Important Updates`}
              detail="-keep Track of all your IP Activity"
            />
          </div>

          {/* my products section */}
          <div className="flex flex-col items-start">
            <div className="flex items-start gap-[16px] self-stretch">
                <Image
                src={"/images/AddIP"}
                width={40}
                height={40}
                alt="IPImage"
                />

            </div>
          </div>
        </div>

        {/* second column */}
        <div className="flex flex-col w-full gap-[40px] self-stretch items-center p-[16px] border border-[#8A8A8A] rounded-md">
          <div className="flex items-start self-stretch mb-[60px]">
            <ReusableHeading text="License Payment" />
            <Link
              className="rounded-[8px] bg-[#373737] justify-center items-center py-[8px] px-[16px] text-[#EFF4F6] text-[16px] font-normal leading-[145%] tracking-[0.32px]"
              href={"/License"}
            >
              Create License
            </Link>
          </div>

          {/* my products section */}
          <div className="w-full flex flex-col">
            <div className="flex gap-[50px] w-full justify-between font-bold text-white min-[2000px]:w-[2560px] border-b border-[#8A8A8A] pb-[16px]">
              <TypesComponent text="Trademark Overview" />
              <TypesComponent text="Owner" className="" />
              <TypesComponent text="Serial Number" />
              <TypesComponent text="Status" />
              <TypesComponent text="Price" />
            </div>
            <Searchfilter />
            <Searchfilter />
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
