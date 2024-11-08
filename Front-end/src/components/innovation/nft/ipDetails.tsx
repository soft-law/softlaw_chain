"use client";
import MaxWidthWrapper from "@/components/MaxWidhWrapper";
import ReusableHeading from "../../textComponent";
import TypesComponent from "../../TypesProps";
// import InputField from "../input";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
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

interface ProtectionType {
  name: string;
  description: string;
  category?: string;
  duration?: string;
  requirements?: string[];
  img?: string;
}

type ProtectionTypeKey = keyof typeof COLLECTION_TYPES;

interface CollectionValue {
  name: string;
  description: string;
  icon?: string;
  category?: string;
  duration?: string;
  requirements?: string[];
}

const COLLECTION_TYPESs = {
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

interface CollectionData {
  name: string;
  description: string;
  prefix: string;
  image: string;
}

const COLLECTION_TYPES = {
  PATENT: {
    name: "patent",
    description:
      "A collection to create Patents property proofs, giving exclusive right over the use.",
    prefix: "pt",
    image:
      "https://harlequin-quiet-smelt-978.mypinata.cloud/ipfs/QmY6zjfSQoS6txxrFPprrPG1rmuh4akkeAPDCspyDiR41j",
  },
  TRADEMARK: {
    name: "trademark",
    description:
      "A collection to create TradeMarks property proofs, giving exclusive rights over the use.",
    prefix: "TM",
    image:
      "https://copper-ready-guanaco-464.mypinata.cloud/ipfs/QmTv2MpubcyxaRguzNMCvQ9pQaqfxgbcxgqLLkCfsE7wcF",
  },
  COPYRIGHT: {
    name: "copyright",
    description:
      "A collection to create Copyright property proofs, giving exclusive rights over the use.",
    prefix: "CCC",
    image:
      "https://harlequin-quiet-smelt-978.mypinata.cloud/ipfs/QmUAFzr4JvuvZH6dbVHGDCcVdVd3ka9C5Aiv3axJc34tfy",
  },
} as const;

interface IpDataProps {
  onDataChange?: (data: any) => void;
  value?: string;
}

export default function IpDetails({ onDataChange, value }: IpDataProps) {
  const { formData, updateFormData } = useContext(FormDataContext);

  const { selectedTabInnovation, setSelectedTabInnovation } =
    useInnovationContext();
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
    updateFormData("Identity", { TypeOfPatent: buttonName });
  };
  const [activeTab, setActiveTab] = useState("collections");
  const [activeType, setActiveType] = useState<ProtectionTypeKey | null>(null);

  const handleSelection = useCallback((type: ProtectionTypeKey) => {
    setActiveType(type);
  }, []);
  
  const clearSelection = useCallback(() => {
    setActiveType(null);
  }, []);
  
  const getRequirementsList = useCallback(() => {
    if (!activeType) return [];
    return COLLECTION_TYPES[activeType] || [];
  }, [activeType]);
  
  const selectedProtection = activeType ? COLLECTION_TYPES[activeType] : null;
  
  const [collection, setCollection] = useState({
    name: "",
    description: "",
    prefix: "",
    image: "",
  });

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
              <ReusableHeading
                text="NFT DETAIL"
                detail="This  will be visible and encrypted within this NFT on the blockchain."
                className="text-[#8A8A8A]"
              />
            </div>

            <div className="flex flex-col mt-[60px] gap-[60px]">
              <UploadMultipleFilesToIPFS />
            </div>

            <div className="flex flex-col gap-[16px] pt-[60px]">
              <TypesComponent
                text="Types of protection"
                className="text-[#fff]"
              />
              
              <div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(COLLECTION_TYPES).map(([key, value]) => (
                    <VariousTypesButton
                      key={key}
                      isActive={
                        activeButton ===
                        "NFT-Based Protection + Jurisdiction Registries"
                      }
                      img={value.image}
                      className={`h-[auto] ${
                        activeButton ===
                        "NFT-Based Protection + Jurisdiction Registries"
                          ? "border-[#FACC15] bg-[#373737]"
                          : "border-[#8A8A8A]"
                      } text-[#D0DFE4] hover:border-[#FACC15] hover:bg-[#373737]`}
                      width="full"
                      text={value.name}
                      detail={value.description}
                      onClick={() => {
                        handleButtonClick(
                          "NFT-Based Protection + Jurisdiction Registries"
                        );
                      }}
                    />
                  ))}
                </div> */}

                {selectedProtection && (
                  <div className="mt-6 p-4 bg-[#373737] rounded-lg">
                    <h3 className="text-[#D0DFE4] text-xl mb-4">
                      {selectedProtection.name} Requirements:
                    </h3>
                    {/* <ul className="list-disc pl-5 text-[#D0DFE4]">
            {getRequirementsList().map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul> */}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start justify-between w-full ">
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
    </>
  );
}
