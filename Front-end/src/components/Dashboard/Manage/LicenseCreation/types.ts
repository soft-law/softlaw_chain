export interface LicenseFormData {
  name?: string;
  description?: string;
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
    expirationDate?: string;
  };
  paymentType: 'oneTime' | 'recurring';
  recurringPayment?: {
    interval: 'monthly' | 'quarterly' | 'annually';
  };
}