'use client'
import MaxWidthWrapper from "../../MaxWidhWrapper";
import Button from "@/components/ui/button";
import InputField from "@/components/ProofOfInnovation/input";
import { getApi } from "@/utils/getApi";
import { getSigner } from "@/utils/getSigner";
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ReusableHeading from "../textComponent";

interface LicenseFormValues {
  name: string;
  description: string;
  filingDate: string;
  jurisdiction: string;
}

const License: React.FC = () => {
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  const validationSchema = Yup.object({
    name: Yup.string().max(30, 'Name is too long').required('NFT Name is required'),
    description: Yup.string().max(250, 'Description is too long').required('Description is required'),
    filingDate: Yup.date().required('Filing Date is required'),
    jurisdiction: Yup.string().max(50, 'Jurisdiction is too long').required('Jurisdiction is required'),
  });

  const handleMintNFT = async (values: LicenseFormValues) => {
    try {
      const api = await getApi();         
      const signer = await getSigner();  

      if (!signer) {
        setSubmissionStatus('Please connect your wallet.');
        return;
      }

      // Send the transaction here using the `api` and `signer`.
      // For example, it might look something like:
      // const txHash = await api.tx.exampleModule.mintNFT(values.name, values.description, values.filingDate, values.jurisdiction).signAndSend(signer);

      setSubmissionStatus('NFT successfully minted!');
    } catch (error) {
      console.log(error);
      setSubmissionStatus('Failed to mint NFT.');
    }
  };

  const formik = useFormik<LicenseFormValues>({
    initialValues: { name: '', description: '', filingDate: '', jurisdiction: '' },
    validationSchema,
    onSubmit: handleMintNFT,
  });

  return (
    <div className="bg-[#1C1A11] min-[2000px]:w-[2880px] flex items-center justify-center min-[2000px]:h-screen text-white px-4 min-h-[800px]">
      <MaxWidthWrapper className="flex flex-col items-center w-full max-w-3xl space-y-4">
        <div className="mb-8">
          <ReusableHeading text="Get a License" />
        </div>
        <form onSubmit={formik.handleSubmit} className="w-full space-y-4">
          <InputField
            id="name"
            label="Name"
            type="text"
            className="w-full"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name && <p className="text-red-500 text-sm">{formik.errors.name}</p>}

          <InputField
            id="description"
            name="description"
            label="Description"
            type="text"
            className="w-full"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}

          <InputField
            type="date"
            id="filingDate"
            name="filingDate"
            label="Date"
            className="w-full"
            value={formik.values.filingDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.filingDate && formik.errors.filingDate && (
            <p className="text-red-500 text-sm">{formik.errors.filingDate}</p>
          )}

          <InputField
            type="text"
            id="jurisdiction"
            label="Jurisdiction"
            name="jurisdiction"
            className="w-full"
            value={formik.values.jurisdiction}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.jurisdiction && formik.errors.jurisdiction && (
            <p className="text-red-500 text-sm">{formik.errors.jurisdiction}</p>
          )}

          <Button cta="Get License" purpose="submit" />

          {submissionStatus && (
            <p className={`text-center mt-4 ${submissionStatus.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
              {submissionStatus}
            </p>
          )}
        </form>
      </MaxWidthWrapper>
    </div>
  );
};

export default License;
