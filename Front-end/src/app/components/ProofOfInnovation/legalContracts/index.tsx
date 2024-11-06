'use client'
import MaxWidthWrapper from "@/app/components/MaxWidhWrapper";
import ReusableHeading from "../textComponent";
import TypesComponent from "../TypesProps";
import VariousTypesButton from "../VariousTypesButton";
import Footer from "@/app/components/Footer";
import { useContext, useState } from "react";
import CollectionTypes from "@/utils/collectionTypes.json";
import { FormDataContext } from "../FormDataContext";
import ConfirmationModal from "../ConfirmationModal";
import { useInnovationTapContext } from "@/context/innovation";


interface LegalContractsProps {
  onDataChange?: (data: any) => void;
}

export default function LegalContracts({ onDataChange }: LegalContractsProps) {
  const {formData, updateFormData} = useContext(FormDataContext);

  const callOnDataChange = () => {
    onDataChange && onDataChange(formData);
  };

  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("collections");

  const {selectedTabInnovation, setSelectedTabInnovation} = useInnovationTapContext()

  const [collection, setCollection] = useState({
    name: "",
    description: "",
    prefix: "",
    image: "",
  });

  
  const handleEditPage = (page: number) => {
    // Assuming 'collections' = page 1, 'nfts' = page 2, 'contracts' = page 3
    const tabKeys = ["IpRegistries", "Identity", "LegalContracts"];
    setActiveTab(tabKeys[page - 1]); // Navigate to the right tab/page
  };
  
  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
    updateFormData("LegalContracts", { TypesOfProtection: buttonName });
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
    setSelectedTabInnovation("2")
  }


  
  return (
    <>
      <div className="bg-[#1C1A11] flex flex-col w-full justify-center items-center text-white min-[2000px]:w-[3000px]">
        <MaxWidthWrapper className="flex flex-col self-stretch min-[2000px]:min-h-screen pt-[120px] justify-center items-center">
          <div className="flex flex-col w-full justify-items-center pb-[120px]">
            <div>
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
            </div>
            
            <div className="flex items-start justify-between w-full pt-[60px]">
              <button
              className="bg-transparent rounded-[16px] px-[20px] py-[8px] w-[128px] items-center text-center min-[2000px]:py-[16px] min-[2000px]:tracking-[1px] min-[2000px]:text-3xl min-[2000px]:w-[200px] flex-shrink-0 border border-[#D0DFE4] text-[#D0DFE4] hover:bg-[#FACC15] hover:text-[#1C1A11]"
              onClick={handleBack}
              >
                Back
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
      <Footer
        width="py-[60px] max-h-[400px]"
        className="border-t-[1px] border-[#8A8A8A] w-full"
      />
    </>
  );
}
