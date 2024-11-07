import { useState } from 'react';
import { InitialForm } from './InitialForm';
// import { LicenseDetailsForm } from './LicenseDetailsForm';
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

  const handleFormUpdate = (updates: Partial<LicenseFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) {
      onCancel();
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
  };

  return (
    <div className="w-full">
      {step === 1 && (
        <InitialForm
          formData={formData}
          onSubmit={(data) => {
            handleFormUpdate(data);
            handleNext();
          }}
        />
      )}
{/*       
      {step === 2 && (
        <LicenseDetailsForm
          formData={formData}
          onSubmit={handleComplete}
          onBack={handleBack}
        />
      )} */}
    </div>
  );
}