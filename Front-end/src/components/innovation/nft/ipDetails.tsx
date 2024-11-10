"use client";
import MaxWidthWrapper from "@/components/MaxWidhWrapper";
import ReusableHeading from "../../textComponent";
import TypesComponent from "../../TypesProps";
import React, {  useState } from "react";
import { useContext } from "react";
import { FormDataContext } from "../../FormDataContext";
import { useInnovationContext } from "@/context/innovation";
import ConfirmationModal from "./confirmation";
import UploadMultipleFilesToIPFS from "@/components/UploadFiles";
import MintNftUnique from "./mintUnique";
import uploadFilePinata from "@/utils/pinataPin";

interface IpDataProps {
  onDataChange?: (data: any) => void;
  value?: string;
}

export default function IpDetails({ onDataChange, value }: IpDataProps) {
  const { formData, updateFormData } = useContext(FormDataContext);

  const {
    selectedTabInnovation,
    setSelectedTabInnovation,
    nftMetadata, setMetadataHash,
    setNftMetadata,metadataHash, ipfsHashes, imageHash, imagesLinks 
  } = useInnovationContext();

  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
    updateFormData("Identity", { TypeOfPatent: buttonName });
  };
  const [activeTab, setActiveTab] = useState("collections");

  const handleEditPage = (page: number) => {
    // Assuming 'collections' = page 1, 'nfts' = page 2, 'contracts' = page 3
    const tabKeys = ["IpRegistries", "Identity", "LegalContracts"];
    setActiveTab(tabKeys[page - 1]); // Navigate to the right tab/page
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

  const handleBack = async () => {
    try {
      setSelectedTabInnovation("2");
      console.log("test", selectedTabInnovation);
    } catch (e) {
      console.log(e);
    }
  };

  const handleConfirmationModal = async () => {
    console.log("hola");
  };

  const handleUploadMetadata = async () => {
    try {
      // Convertir metadata a Blob
      const metadataBlob = new Blob([JSON.stringify(nftMetadata)], {
        type: "application/json",
      });

      // Convertir Blob a File
      const metadataFile = new File([metadataBlob], "metadata.json", {
        type: "application/json",
      });

      const metadataCid = await uploadFilePinata(metadataFile);
      const metadataUrl = `https://harlequin-quiet-smelt-978.mypinata.cloud/ipfs/${metadataCid}`;
      console.log(
        "CID del JSON con todos los enlaces de imágenes:",
        metadataUrl
      );
      setMetadataHash(metadataCid);

      return metadataCid;
    } catch (error) {
      console.error("Error uploading metadata:", error);
      return [];
    }
  };

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
                  console.log(
                    "Collection Metadata: ",
                    "NFT Metadata:",
                    nftMetadata,
                    "NFT Details:",
                    "IPFS HASHES:",
                    ipfsHashes,
                    "IMAGE HASH",
                    imageHash,
                    "iMAGES lINKS",
                    imagesLinks,
                    "metadata JSON CID",
                    metadataHash,

                  );
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
                    onClose={handleCloseModal}
                    onEditPage={handleEditPage}
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
