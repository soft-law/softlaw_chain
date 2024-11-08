"use client";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidhWrapper";
import { useContext } from "react";
// import { FormDataContext } from "../../ProofOfInnovation/FormDataContext";
// import { useDashboardTapContext } from "@/context/dashboard";
import Footer from "../../Footer";
// import ReusableHeading from "../../ProofOfInnovation/textComponent";
import Image from "next/image";
import Link from "next/link";
// import TypesComponent from "@/components/ProofOfInnovation/TypesProps";
import { Button } from "@/components/ui/button";
// import { LicenseCreationFlow } from "@/components/Dashboard/Manage/LicenseCreation/LicenseFlowCreation";
import type { LicenseFormData } from "./LicenseCreation/types";
import { Card } from "@/components/ui/card";
import { FormDataContext } from "@/components/FormDataContext";
import { useDashboardContext } from "@/context/dashboard";
import ReusableHeading from "@/components/textComponent";
import TypesComponent from "@/components/TypesProps";
import { LicenseCreationFlow } from "./LicenseCreation/LicenseFlowCreation";

interface ManageProps {
  onDataChange: (data: any) => void;
}


interface License extends LicenseFormData {
  status: string;
  royaltyRate: string;
  lifetimeEarnings: string;
  recentPayment: string;
  amount: string;
}

export default function Manage({ onDataChange }: ManageProps) {
  const [showLicenseCreation, setShowLicenseCreation] = useState(false);
  const [licenses, setLicenses] = React.useState<License[]>([]);



  const handleLicenseCreation = (data: LicenseFormData) => {
    // Adds the new license to the list
    setLicenses((prev) => [
      ...prev,
      {
        id: Date.now(), // temporary ID for demo
        ...data,
        status: "Active",
        royaltyRate: "10%",
        lifetimeEarnings: "$2.45",
        recentPayment: "Oct. 24",
        amount: "+$252",
      } as License,
    ]);
    setShowLicenseCreation(false);
  };

  const { selectedTabDashboard,
    setSelectedTabDashboard } =
    useDashboardContext();

  const { formData, updateFormData } = useContext(FormDataContext);

  return (
    <div className="bg-[#1C1A11] flex flex-col flex-shrink-0 w-full justify-center items-center text-white min-[2000px]:w-[3000px]">
      <MaxWidthWrapper className="flex flex-col self-stretch min-[2000px]:min-h-screen pt-[120px] justify-center items-center">
        {/* Important Updates Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#F6E18B]">
            Important Updates
          </h2>
          {licenses.length > 0 && (
            <div className="space-y-2">
              {licenses.map((license) => (
                <div key={license.nftId} className="bg-[#373737] p-4 rounded-lg flex justify-between items-center">
                <span>The license for NFT ID: {license.nftId} has been created successfully.</span>
                <div className="space-x-2">
                  <button className="px-3 py-1 bg-red-500 text-white rounded">Cancel</button>
                  <button className="px-3 py-1 bg-green-500 text-white rounded">Accept</button>
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col w-full gap-[40px] self-stretch items-center p-[16px] border border-[#8A8A8A] rounded-md">
          <div className="flex justify-between items-start self-stretch mb-[60px]">
            <ReusableHeading text="All IPs" />
            <Button
              onClick={() => setShowLicenseCreation(true)}
              className="bg-[#F6E18B] text-black hover:bg-[#dcc87d]"
            >
              Create License
            </Button>
          </div>

          {showLicenseCreation ? (
            <LicenseCreationFlow
              onComplete={handleLicenseCreation}
              onCancel={() => setShowLicenseCreation(false)}
            />
          ) : (
            <div className="space-y-6">
              {licenses.length === 0 ? (
                <p className="text-center text-gray-400">
                  No licenses created yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {licenses.map((license: License) => (
                   <Card key={license.nftId} className="p-4 bg-[#1C1A11] border-[#373737]">
                   <div className="grid grid-cols-6 gap-4 items-center">
                     <div className="col-span-2">
                       <h3 className="font-bold">{license.nftId}</h3>
                       <p className="text-sm text-gray-400">Royalty Rate: {license.royaltyRate}</p>
                     </div>
                     <div className="text-center">
                       <span className="px-2 py-1 bg-green-500 rounded text-sm">
                         {license.status}
                       </span>
                     </div>
                     <div className="text-center text-green-500">
                       {license.lifetimeEarnings}
                     </div>
                     <div className="text-center">
                       {license.recentPayment}
                     </div>
                     <div className="text-right text-green-500">
                       {license.amount}
                     </div>
                   </div>
                 </Card>
                    
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </MaxWidthWrapper>
      <Footer
        width="py-[60px] max-h-[400px]"
        className="border-t-[1px] border-[#8A8A8A] w-full"
      />
    </div>
  );
}
