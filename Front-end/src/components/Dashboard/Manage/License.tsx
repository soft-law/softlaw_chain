"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { LicenseCreationFlow } from "./LicenseCreation/LicenseFlowCreation";
import type { LicenseFormData } from "./LicenseCreation/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ManageProps {
  onDataChange?: (data: any) => void;
}
interface License extends LicenseFormData {
  status: string;
  royaltyRate: string;
  lifetimeEarnings: string;
  recentPayment: string;
  amount: string;
}

export default function Licensing({ onDataChange }: ManageProps) {
  // Get URL parameters
  const searchParams = useSearchParams();
  const [showLicenseCreation, setShowLicenseCreation] = useState(true);
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
  return (
    <div className="bg-[#1C1A11] w-full justify-center self-stretch items-center min-[2000px]:min-h-screen min-[2000px]:w-[3000px] gap-[40px] pt-[40px] pb-[120px] mx-auto p-6 scrollable">
      {showLicenseCreation ? (
          <LicenseCreationFlow
            onComplete={handleLicenseCreation}
            onCancel={() => setShowLicenseCreation(false)}
          />
      ) : (
        <div className="space-y-6">
          {licenses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-center text-gray-400">
                No licenses created yet.
              </p>
              <Button
                onClick={() => setShowLicenseCreation(true)}
                className="bg-[#373737] text-white hover:bg-[#FACC15] hover:text-[#1C1A11] px-4 py-2 rounded"
              >
                Create New License
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {licenses.map((license: License) => (
                <Card
                  key={license.nftId}
                  className="p-4 bg-[#1C1A11] border-[#373737]"
                >
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2">
                      <h3 className="font-bold">{license.nftId}</h3>
                      <p className="text-sm text-gray-400">
                        Royalty Rate: {license.royaltyRate}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="px-2 py-1 bg-green-500 rounded text-sm">
                        {license.status}
                      </span>
                    </div>
                    <div className="text-center text-green-500">
                      {license.lifetimeEarnings}
                    </div>
                    <div className="text-center">{license.recentPayment}</div>
                    <div className="text-right text-green-500">
                      {license.amount}
                    </div>
                  </div>
                </Card>
              ))}
              <div className="text-center mt-6">
                <Button
                onClick={() => setShowLicenseCreation(true)}
                  className="bg-[#373737] text-white hover:bg-[#FACC15] hover:text-[#1C1A11] px-4 py-2 rounded"
                >
                Create Another License
                </Button>
              </div>
              
            </div>
          )}
        </div>
      )}
    </div>
  );
}
