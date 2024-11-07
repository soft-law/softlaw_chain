export interface LicenseFormData {
    nftId: string;
  price: {
    amount: number;
    currency: string;
  };
  licenseType: 'exclusive' | 'nonExclusive';
  durationType: 'permanent' | 'custom';
  customDuration?: {
    value: number;
    unit: 'days' | 'months' | 'years';
  };
  paymentType: 'oneTime' | 'recurring';
  recurringPayment?: {
    interval: 'monthly' | 'quarterly' | 'annually';
  };
}