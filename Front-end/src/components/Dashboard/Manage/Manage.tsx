"use client";
import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/MaxWidhWrapper";
import { useContext } from 'react';
import { FormDataContext } from "../../ProofOfInnovation/FormDataContext";
import { useDashboardTapContext } from "@/context/dashboard";
import Footer from "../../Footer"
import ReusableHeading from "../../ProofOfInnovation/textComponent";
import Image from "next/image";
import Link from "next/link";
import TypesComponent from "@/components/ProofOfInnovation/TypesProps";
import { Button } from '@/components/ui/button';
import { LicenseCreationFlow } from '@/components/Dashboard/Manage/LicenseCreation/LicenseCreationFlow';
import type { LicenseFormData } from '@/components/Dashboard/Manage/LicenseCreation/types';

interface ManageProps {
  onDataChange: (data: any) => void;
}

export default function Manage ({onDataChange}: ManageProps) {

  const [showLicenseCreation, setShowLicenseCreation] = useState(false);
  const [licenses, setLicenses] = useState<LicenseFormData[]>([]);

  const handleLicenseCreation = (data: LicenseFormData) => {
    setLicenses(prev => [...prev, data]);
    setShowLicenseCreation(false);
  };

  const {selectedTabDashboard,
    setSelectedTabDashboard} = useDashboardTapContext()

  const {formData, updateFormData} = useContext(FormDataContext);

  return (
    <div className="bg-[#1C1A11] flex flex-col flex-shrink-0 w-full justify-center items-center text-white min-[2000px]:w-[3000px]">
    
      <MaxWidthWrapper className="flex flex-col self-stretch min-[2000px]:min-h-screen pt-[120px] justify-center items-center">
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
              <p className="text-center text-gray-400">No licenses created yet.</p>
            ) : (
              <div className="space-y-4">
                {licenses.map((license, index) => (
                  <div
                    key={index}
                    className="bg-[#373737] p-4 rounded-md"
                  >
                    <p>NFT ID: {license.nftId}</p>
                    <p>Price: {license.price.amount} {license.price.currency}</p>
                    <p>Type: {license.licenseType}</p>
                    <p>Duration: {license.durationType}</p>
                    <p>Payment: {license.paymentType}</p>
                  </div>
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
