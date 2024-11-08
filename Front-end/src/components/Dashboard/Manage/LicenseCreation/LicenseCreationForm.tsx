import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import type { LicenseFormData } from './types';


interface LicenseCreationFormProps {
    formData: LicenseFormData;
    onSubmit: (data: Partial<LicenseFormData>) => void;
    onBack: () => void;
  }

  export function LicenseCreationForm({ formData, onSubmit, onBack }: LicenseCreationFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };
  
    return (
      <Card className="w-full max-w-2xl mx-auto p-6 bg-[#1C1A11] border-[#373737]">
        <h2 className="text-2xl font-bold mb-6 text-[#F6E18B]">LICENSE CREATION FORM</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">NFT ID</label>
              <Input
                value={formData.nftId}
                onChange={(e) => onSubmit({ ...formData, nftId: e.target.value })}
                className="bg-[#373737] border-none text-white"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">License Price</label>
                <Input
                  type="number"
                  value={formData.price.amount}
                  onChange={(e) => onSubmit({
                    ...formData,
                    price: { ...formData.price, amount: Number(e.target.value) }
                  })}
                  className="bg-[#373737] border-none text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Currency</label>
                <select
                  value={formData.price.currency}
                  onChange={(e) => onSubmit({
                    ...formData,
                    price: { ...formData.price, currency: e.target.value }
                  })}
                  className="w-full bg-[#373737] border-none text-white rounded-md p-2"
                >
                  <option value="SLAW">SLAW</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => onSubmit({ ...formData, durationType: 'permanent' })}
                className={`p-4 ${
                  formData.durationType === 'permanent'
                    ? 'bg-[#F6E18B] text-black'
                    : 'bg-[#373737] text-white'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">None (Permanent)</div>
                  <div className="text-sm opacity-70">This license will not expire.</div>
                </div>
              </Button>
  
              <Button
                type="button"
                onClick={() => onSubmit({ ...formData, durationType: 'custom' })}
                className={`p-4 ${
                  formData.durationType === 'custom'
                    ? 'bg-[#F6E18B] text-black'
                    : 'bg-[#373737] text-white'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">Set Custom Duration</div>
                  <div className="text-sm opacity-70">Enter the number of days or blocks this license will remain valid.</div>
                </div>
              </Button>
            </div>
  
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                onClick={() => onSubmit({ ...formData, paymentType: 'oneTime' })}
                className={`p-4 ${
                  formData.paymentType === 'oneTime'
                    ? 'bg-[#F6E18B] text-black'
                    : 'bg-[#373737] text-white'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">One-Time Payment</div>
                  <div className="text-sm opacity-70">A single upfront fee for the license.</div>
                </div>
              </Button>
  
              <Button
                type="button"
                onClick={() => onSubmit({ ...formData, paymentType: 'recurring' })}
                className={`p-4 ${
                  formData.paymentType === 'recurring'
                    ? 'bg-[#F6E18B] text-black'
                    : 'bg-[#373737] text-white'
                }`}
              >
                <div className="text-left">
                  <div className="font-semibold">Recurring Payment</div>
                  <div className="text-sm opacity-70">Allows for ongoing payments, such as monthly or annual fees.</div>
                </div>
              </Button>
            </div>
          </div>
  
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              onClick={onBack}
              className="bg-transparent border border-[#F6E18B] text-[#F6E18B] hover:bg-[#373737]"
            >
              Back
            </Button>
            <Button
              onClick={handleSubmit}
              type="submit"
              className="bg-[#F6E18B] text-black hover:bg-[#dcc87d]"
            >
              Next
            </Button>
          </div>
        </form>
      </Card>
    );
  }