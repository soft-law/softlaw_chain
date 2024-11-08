import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LicenseFormData } from "./types";
import AlertDialog from "./AlertDialogue"; 

interface LicenseSampleFormProps {
  formData: LicenseFormData;
  onSubmit: (data: LicenseFormData) => void;
  onBack: () => void;
}

export function LicenseSampleForm({
  formData,
  onSubmit,
  onBack,
}: LicenseSampleFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleCreate = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    setShowConfirmDialog(false);
    onSubmit(formData);
  };

  return (
    <div>
      <Card className="max-w-2xl mx-auto p-6 bg-[#1C1A11] border-[#373737]">
        <h2 className="text-2xl font-bold mb-6 text-[#F6E18B]">
          LICENSE CREATION FORM
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Display selection from the last form */}
          <div className="bg-[#373737] p-4 rounded-md">
            <p>NFT ID: {formData.nftId}</p>
            <p>
              Price: {formData.price.amount} {formData.price.currency}
            </p>
          </div>

          {/* License Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-4 rounded-md cursor-pointer ${
                formData.licenseType === "exclusive"
                  ? "border-[#F6E18B]"
                  : "border-[#373737]"
              } border`}
              onClick={() =>
                onSubmit({ ...formData, licenseType: "exclusive" })
              }
            >
              <h3 className="font-semibold">An Exclusive License</h3>
              <p className="text-sm text-gray-400">
                Restricts usage rights to a single licensee. No other person or
                entity, including the owner, can license this NFT to others for
                the license.
              </p>
            </div>

            <div
              className={`p-4 rounded-md cursor-pointer ${
                formData.licenseType === "nonExclusive"
                  ? "border-[#F6E18B]"
                  : "border-[#373737]"
              } border`}
              onClick={() =>
                onSubmit({ ...formData, licenseType: "nonExclusive" })
              }
            >
              <h3 className="font-semibold">A Non-Exclusive License</h3>
              <p className="text-sm text-gray-400">
                Allows multiple licensees to use the NFT at the same time. The
                owner can issue the same license to other buyers.
              </p>
            </div>
          </div>

          {/* Custom Duration fields only show when selected */}
          {formData.durationType === "custom" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Duration"
                  value={formData.customDuration?.value || ""}
                  onChange={(e) =>
                    onSubmit({
                      ...formData,
                      customDuration: {
                        ...formData.customDuration,
                        value: Number(e.target.value),
                      },
                    })
                  }
                  className="bg-[#373737] border-none text-white"
                />
                <select
                  value={formData.customDuration?.unit}
                  onChange={(e) =>
                    onSubmit({
                      ...formData,
                      customDuration: {
                        ...formData.customDuration,
                        unit: e.target.value as "days" | "months" | "years",
                      },
                    })
                  }
                  className="bg-[#373737] border-none text-white rounded-md p-2"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
              <Input
                type="date"
                value={formData.customDuration?.expirationDate || ""}
                onChange={(e) =>
                  onSubmit({
                    ...formData,
                    customDuration: {
                      ...formData.customDuration,
                      expirationDate: e.target.value,
                    },
                  })
                }
                className="bg-[#373737] border-none text-white"
              />
            </div>
          )}

          {/* Recurring payment field will only show when selected */}

          {formData.paymentType === "recurring" && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button
                  type="button"
                  onClick={() =>
                    onSubmit({
                      ...formData,
                      recurringPayment: { interval: "monthly" },
                    })
                  }
                  className={`${
                    formData.recurringPayment?.interval === "monthly"
                      ? "bg-[#F6E18B] text-black"
                      : "bg-[#373737] text-white"
                  }`}
                >
                  Monthly
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    onSubmit({
                      ...formData,
                      recurringPayment: { interval: "quarterly" },
                    })
                  }
                  className={`${
                    formData.recurringPayment?.interval === "quarterly"
                      ? "bg-[#F6E18B] text-black"
                      : "bg-[#373737] text-white"
                  }`}
                >
                  Quarterly
                </Button>
                <Button
                  type="button"
                  onClick={() =>
                    onSubmit({
                      ...formData,
                      recurringPayment: { interval: "annually" },
                    })
                  }
                  className={`${
                    formData.recurringPayment?.interval === "annually"
                      ? "bg-[#F6E18B] text-black"
                      : "bg-[#373737] text-white"
                  }`}
                >
                  Annually
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={onBack}
              className="bg-transparent border border-[#F6E18B] text-[#F6E18B] hover:bg-[#373737]"
            >
              Back
            </Button>
            <Button
              onClick={handleCreate}
              type="submit"
              className="bg-[#F6E18B] text-black hover:bg-[#dcc87d]"
            >
              Create
            </Button>
          </div>
        </form>
      </Card>

     <AlertDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirm}
        title="Confirm License Creation"
        description="Please review your answers carefully. Once created, the license details cannot be edited."
        confirmText="Create License"
        cancelText="Review Again"
      />
    </div>
  );
}
