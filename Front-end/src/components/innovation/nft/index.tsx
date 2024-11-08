"use client";
import MaxWidthWrapper from "@/components/MaxWidhWrapper";
import ReusableHeading from "../../textComponent";
import TypesComponent from "../../TypesProps";
// import InputField from "../input";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import VariousTypesButton from "../../VariousTypesButton";
import { useContext } from "react";
import { FormDataContext } from "../../FormDataContext";
// import * as yup from 'yup';
// import { useForm } from "react-hook-form";
// import { yupResolver } from '@hookform/resolvers/yup';
import Button from "../../ui/button";
import { useInnovationContext } from "@/context/innovation";
import InputField from "../../RicardianContracts.tsx/input";
import Footer from "../../Footer";
import CollectionTypes from "@/utils/collectionTypes.json";
import ConfirmationModal from "../confirmation";
import SelectField from "../../RicardianContracts.tsx/select";
import UploadMultipleFilesToIPFS from "@/components/UploadFiles";

// interface LegalContractsProps {
//   onDataChange?: (data: any) => void;
// }

interface CollectionValue {
  name: string;
  description: string;
  icon?: string;
  category?: string;
  duration?: string;
  requirements?: string[];
}

const COLLECTION_TYPES = {
  UTILITY_PATENT: {
    name: "Utility Patent",
    description:
      "Protects new inventions or functional improvements to existing products.",
    category: "Patents",
    duration: "20 years",
    requirements: ["Must be novel", "Must be non-obvious", "Must be useful"],
  },
  DESIGN_PATENT: {
    name: "Design Patent",
    description:
      "Protects the unique appearance or ornamental design of a product.",
    category: "Patents",
    duration: "15 years",
    requirements: [
      "Must be novel",
      "Must be non-obvious",
      "Must be ornamental",
    ],
  },
  PROVISIONAL_PATENT: {
    name: "Provisional Patent",
    description:
      "A temporary application that gives you 12 months to file a full utility patent.",
    category: "Patents",
    duration: "12 months",
    requirements: [
      "Must file non-provisional within 12 months",
      "Must adequately describe invention",
    ],
  },
  PLANT_PATENT: {
    name: "Plant Patent",
    description:
      "For new and distinct plant varieties reproduced through asexual means.",
    category: "Patents",
    duration: "20 years",
    requirements: [
      "Must be novel",
      "Must be non-obvious",
      "Must be asexually reproducible",
    ],
  },
};

interface IpDataProps {
  onDataChange?: (data: any) => void;
  value?: string;
}

export default function IpData({ onDataChange, value }: IpDataProps) {
  const { formData, updateFormData } = useContext(FormDataContext);

  const {
    selectedTabInnovation,
    setSelectedTabInnovation,
    collection,
    setCollection,
    nft,
    setNft,
  } = useInnovationContext();

  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
    updateFormData("Identity", { TypeOfPatent: buttonName });
  };
  const [activeTab, setActiveTab] = useState("collections");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("Identity", { PatentTitle: e.target.value });
  };

  const handlePatentNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("Identity", { PatentNumber: e.target.value });
  };

  const handleFillingDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = new Date(e.target.value);
    updateFormData("Identity", { FillingDate: dateValue });
  };

  const callOnDataChange = () => {
    onDataChange && onDataChange(formData);
  };

  const handleFileUpload = (file: File) => {
    updateFormData("LegalContracts", { UploadFile: file });
    // onDataChange(formData);
  };

  const handleSelectCollection = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("LegalContracts", { Collection: e.target.value });
    // onDataChange(formData);
  };

  const handleEditPage = (page: number) => {
    // Assuming 'collections' = page 1, 'nfts' = page 2, 'contracts' = page 3
    const tabKeys = ["IpRegistries", "Identity", "LegalContracts"];
    setActiveTab(tabKeys[page - 1]); // Navigate to the right tab/page
  };
  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData("LegalContracts", { Description: e.target.value });
    // onDataChange(formData);
  };

  const handleSubmit = () => {
    // Handle final form submission
    console.log("Final form data:", formData);
    handleOpenModal();
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCollectionSelect = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCollection = CollectionTypes.find(
      (type) => type.name === event.target.value
    );

    if (selectedCollection) {
      setCollection({
        name: selectedCollection.name,
        description: selectedCollection.description,
        prefix: selectedCollection.prefix,
        image: selectedCollection.image,
      });
    }
  };

  const supportedImages = ["JPG", "PNG", "GIF", "SVG"];

  const handleSubmitForm = async () => {
    console.log("hola");
  };

  const handleBack = async () => {
    try {
      setSelectedTabInnovation("1");
      console.log("test", selectedTabInnovation);
    } catch (e) {
      console.log(e);
    }
  };

  const handleNext = async () => {
    try {
      setSelectedTabInnovation("2");
      console.log("test", selectedTabInnovation);
    } catch (e) {
      console.log(e);
    }
  };

  const patentTypesMap = [
    {
      text: "Utility Patent",
      detail:
        "Protects new inventions or functional improvements to existing products, processes, or machines. This is the most common type of patent, covering how an invention works.",
      img: "/path/to/utility-patent-image.svg",
      altText: "Utility Patent Icon",
      width: "full",
    },
    {
      text: "Design Patent",
      detail:
        "Protects the unique appearance or ornamental design of a product rather than its function. For example, the shape of a car or the design of a smartphone.",
      img: "/path/to/design-patent-image.svg",
      altText: "Design Patent Icon",
      width: "full",
    },
    {
      text: "Provisional Patent",
      detail:
        "A temporary application that gives you an early filing date and up to 12 months to file a full utility patent. This option is useful if your invention is still in development.",
      img: "/path/to/provisional-patent-image.svg",
      altText: "Provisional Patent Icon",
      width: "full",
    },
    {
      text: "Plant Patent",
      detail:
        "Granted for the invention or discovery of a new and distinct plant variety, reproduced through asexual means like grafting or cutting, rather than seeds.",
      img: "/path/to/plant-patent-image.svg",
      altText: "Plant Patent Icon",
      width: "full",
    },
  ] as const;

  const type = "number";

  return (
    <>
      <div className="bg-[#1C1A11] flex flex-col flex-shrink-0 w-full justify-center items-center text-white min-[2000px]:w-[3000px]">
        <MaxWidthWrapper className="flex flex-col self-stretch pt-[120px] justify-center items-center">
          <div className="flex flex-col w-full justify-items-center pb-[120px] gap-[60px]">
            <div className="">
              {/* <ReusableHeading
                text="intellectual property data Entry"
                detail="Please Fill in the Matching Patent Details"
                className="text-[#8A8A8A]"
              /> */}
              <ReusableHeading
                text="NFT DETAIL"
                detail="This  will be visible and encrypted within this NFT on the blockchain."
                className="text-[#8A8A8A]"
              />
            </div>

            <div className="flex flex-col gap-[16px] pt-[60px]">
              <TypesComponent
                text="Types of protection"
                className="text-[#fff]"
              />
              <div className="flex items-start space-x-4 gap-[16px] self-stretch">
                <VariousTypesButton
                  isActive={activeButton === "NFT-based protection"}
                  img="/images/shield.svg"
                  className={`h-[auto] ${
                    activeButton === "NFT-based protection"
                      ? "border-[#FACC15] bg-[#373737]"
                      : "border-[#8A8A8A]"
                  } text-[#D0DFE4] hover:border-[#FACC15] hover:bg-[#373737]`}
                  width="full"
                  text="NFT-based protection"
                  detail="Secure your creation by turning it into an NFT, providing instant blockchain-based ownership and protection against unauthorized use.

                Recommend For: Creators looking for instant, blockchain-based security for their creations."
                  onClick={() => {
                    handleButtonClick("NFT-based protection");
                  }}
                />
                <VariousTypesButton
                  isActive={
                    activeButton ===
                    "NFT-Based Protection + Jurisdiction Registries"
                  }
                  img="/images/yellowshield.svg"
                  className={`h-[auto] ${
                    activeButton ===
                    "NFT-Based Protection + Jurisdiction Registries"
                      ? "border-[#FACC15] bg-[#373737]"
                      : "border-[#8A8A8A]"
                  } text-[#D0DFE4] hover:border-[#FACC15] hover:bg-[#373737]`}
                  width="full"
                  text="NFT-Based Protection + Jurisdiction Registries"
                  detail="Boost your protection by registering your NFT with legal authorities globally, combining blockchain security with legal recognition across jurisdictions. Recommended for: Creators seeking comprehensive protection, combining blockchain security with legal jurisdictional safeguards."
                  onClick={() => {
                    handleButtonClick(
                      "NFT-Based Protection + Jurisdiction Registries"
                    );
                  }}
                />
              </div>

              <div className="flex items-start mt-[60px] gap-[60px]">
                <div className="flex flex-col items-start gap-[6px]">
                  <InputField
                    id="NFTName"
                    label="Intellectual Property Name"
                    className=" min-w-[280px] w-full text-[#fff]"
                    type={"text"}
                    // {...register ("NFTName")}
                    // value={formData.LegalContracts.NFTName}
                    // error={errors.NFTName?.message}
                    onChange={handleInputChange}
                  />

                  <TypesComponent
                    className="text-[#8A8A8A] "
                    text={`Enter a name that can match your patent name, making it easily searchable. Choose a descriptive and unique name for clear identification.`}
                  />
                </div>
                <div className="flex flex-col items-start self-stretch gap-[8px]">
                  <InputField
                    // optionText="Select a Patent Title"
                    id="PatentTitle"
                    label="Technical Name"
                    value={formData.Identity.PatentTitle}
                    type={"text"}
                    // icon={true}
                    className=" min-w-[280px]"
                    onChange={handleInputChange}
                    // options={[
                    //   { value: "utility", label: "Utility Patent" },
                    //   { value: "design", label: "Design Patent" },
                    //   { value: "provisional", label: "Provisional Patent" },
                    //   { value: "plant", label: "Plant Patent" },
                    // ]}
                    // {...register ("PatentTitle")}
                    // error={errors.PatentTitle?.message}
                  />
                  <TypesComponent
                    className="text-[#8A8A8A] "
                    text={`Enter the technical legal-name that can match your patent name, making it easily searchable. Choose a descriptive and unique name for clear identification.`}
                  />
                </div>
              </div>

              <div className="flex items-start mt-[60px] gap-[60px]">
                <div className="flex flex-col items-start self-stretch gap-[8px] w-full">
                  <InputField
                    id="Description"
                    type="description"
                    // style="w-full min-w-[280px] h-[123px]"
                    value={formData.LegalContracts.Description}
                    hasDropdown={false}
                    label="Description"
                    onChange={handleDescription}
                    // {...register("Description")}
                    // error={errors.Description?.message}
                  />

                  <TypesComponent
                    text="Write a short description which should clearly describe your product."
                    className=" text-[#8A8A8A] "
                  />
                </div>
              </div>

              <div className="flex items-start mt-[60px] gap-[60px]">
                <div className="flex flex-col items-start gap-[6px]">
                  <InputField
                    id="I.P. Number"
                    label="Registration Number"
                    type={"number"}
                    // {...register ("PatentNumber")}
                    // error={errors.PatentNumber?.message}
                    value={formData.Identity.PatentNumber}
                    onChange={handlePatentNumber}
                    className=" min-w-[280px] w-full"
                  />

                  <TypesComponent
                    className="text-[#8A8A8A] "
                    text={`A unique identifier issued once your patent is officially approved and published to track and reference your patent in legal. ${(
                      <br />
                    )} Example: US1234567B1.`}
                  />
                </div>
                <InputField
                  id="FillingDate"
                  label="First Use Date"
                  value={
                    formData.Identity.FillingDate
                      ? formData.Identity.FillingDate.toISOString().substring(
                          0,
                          10
                        )
                      : ""
                  }
                  // {...register ("FillingDate")}
                  onChange={handleFillingDate}
                  type="Date"
                  className=" w-[280px]"
                />
              </div>
            </div>

            <div className="flex items-start justify-between w-full ">
              {/* <Link
                href="/dashboard"
                className="bg-transparent rounded-[16px] px-[20px] py-[8px] w-[128px] items-center text-center min-[2000px]:py-[16px] min-[2000px]:tracking-[1px] min-[2000px]:text-3xl min-[2000px]:w-[200px] flex-shrink-0 border border-[#D0DFE4] text-[#D0DFE4] hover:bg-[#FACC15]  hover:text-[#1C1A11] hover:border-none"
                children="Cancel"
              /> */}
              {/* <Link
                href="/LegalContracts"
                className="bg-[#D0DFE4] min-[2000px]:py-[16px] min-[2000px]:tracking-[1px] min-[2000px]:text-3xl w-[128px] min-[2000px]:w-[200px] items-center text-center rounded-[16px] text-[#1C1A11] px-[22px] py-[8px] flex-shrink-0 hover:bg-[#FACC15]"
                children="Next"
              /> */}
              {/* <button
               className="bg-transparent rounded-[16px] px-[20px] py-[8px] w-[128px] items-center text-center min-[2000px]:py-[16px] min-[2000px]:tracking-[1px] min-[2000px]:text-3xl min-[2000px]:w-[200px] flex-shrink-0 border border-[#D0DFE4] text-[#D0DFE4] hover:bg-[#FACC15]  hover:text-[#1C1A11] hover:border-none"
              onClick={handleBack}
              >
                Back
              </button> */}
              <button
                className="bg-transparent rounded-[16px] px-[20px] py-[8px] w-[128px] items-center text-center min-[2000px]:py-[16px] min-[2000px]:tracking-[1px] min-[2000px]:text-3xl min-[2000px]:w-[200px] flex-shrink-0 border border-[#D0DFE4] text-[#D0DFE4] hover:bg-[#FACC15]  hover:text-[#1C1A11] hover:border-none"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                onClick={() => {
                  console.log(collection);
                }}
                className="bg-[#D0DFE4] min-[2000px]:py-[16px] min-[2000px]:tracking-[1px] min-[2000px]:text-3xl w-[128px] min-[2000px]:w-[200px] items-center text-center rounded-[16px] text-[#1C1A11] px-[22px] py-[8px] flex-shrink-0 hover:bg-[#FACC15]"
              >
                Test
              </button>

              <div>
                {/* Once the final page is completed, submit */}
                <button
                  onClick={handleOpenModal}
                  className="bg-[#D0DFE4] min-[2000px]:py-[16px] min-[2000px]:tracking-[1px] min-[2000px]:text-3xl w-[128px] min-[2000px]:w-[200px] items-center text-center rounded-[16px] text-[#1C1A11] px-[22px] py-[8px] flex-shrink-0 hover:bg-[#FACC15]"
                >
                  Submit
                </button>

                {isModalOpen && (
                  <ConfirmationModal
                    formData={formData}
                    onClose={handleCloseModal}
                    onEditPage={handleEditPage}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
      {/* <Footer
        width="py-[60px] min-[2000px]:py-[70px] max-h-[400px]"
        className="border-t-[1px] border-[#8A8A8A] w-full"
      /> */}
    </>
  );
}
