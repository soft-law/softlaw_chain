import { useState } from 'react';
import { LicenseCreationForm } from './LicenseCreationForm';
import { LicenseSampleForm } from './LicenseSampleForm';
import type { LicenseFormData } from './types';

interface LicenseCreationFlowProps {
  onComplete: (data: LicenseFormData) => void;
  onCancel: () => void;
}

export function LicenseCreationFlow({ onComplete, onCancel }: LicenseCreationFlowProps) {
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<LicenseFormData>({
    nftId: '',
    price: {
      amount: 0,
      currency: 'SLAW'
    },
    licenseType: 'exclusive',
    durationType: 'permanent',
    paymentType: 'oneTime'
  });

  // const handleFormUpdate = (updates: Partial<LicenseFormData>) => {
  //   setFormData(prev => ({ ...prev, ...updates }));
  // };

  const handleFormChange = (newData: LicenseFormData) => {
    setFormData(newData);
  };

  const handleFormSubmit = (data: LicenseFormData) => {
    // Handle form submission
    console.log('Form submitted:', data);
    // Navigate to next page or process form
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      onCancel();
    }else {
      setStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
  };



  return (
    <div className="w-full">
      {step === 1 && (
        <LicenseCreationForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={() =>  handleNext()}
            // handleFormUpdate(data);
          onBack={handleBack}
        />
      )}

      {step === 2 && (
        <LicenseSampleForm 
        formData={formData}
        onSubmit={handleComplete}
        onBack={handleBack}
        onChange={handleFormChange}
        />
      )}
    </div>
  );
}