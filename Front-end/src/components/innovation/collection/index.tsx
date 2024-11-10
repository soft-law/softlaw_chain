"use client";
import React, { useState } from "react";
import { useToast } from "../../../hooks/use-toast";
import Link from "next/link";
import ReusableHeading from "../../textComponent";
import TypesComponent from "../../TypesProps";
import VariousTypesButton from "../../VariousTypesButton";
import MaxWidthWrapper from "../../MaxWidhWrapper";
import { useInnovationContext } from "@/context/innovation";
import uploadFilePinata from "@/utils/pinataPin";
import Loading from "@/components/Loading";
import MintUniqueCollection from "./mintUnique";
import { ChainSelector } from "./chainSelector";

interface CollectionType {
  name: string;
  description: string;
  prefix: string;
  image: string;
}
const COLLECTION_TYPES = [
  {
    name: "patent",
    description:
      "A collection to create Patents property proofs, giving exclusive right over the use.",
    prefix: "pt",
    image:
      "https://harlequin-quiet-smelt-978.mypinata.cloud/ipfs/QmY6zjfSQoS6txxrFPprrPG1rmuh4akkeAPDCspyDiR41j",
  },
  {
    type: "trademark",
    name: "trademark legal protection",
    description:
      "A collection to create and Manage TradeMarks property proofs, giving exclusive rights to the owner over the use.",
    prefix: "TM",
    image:
      "https://copper-ready-guanaco-464.mypinata.cloud/ipfs/QmTv2MpubcyxaRguzNMCvQ9pQaqfxgbcxgqLLkCfsE7wcF",
  },
  {
    name: "copyright",
    description:
      "A collection to create Copyright property proofs, giving exclusive rights over the use.",
    prefix: "CCC",
    image:
      "https://harlequin-quiet-smelt-978.mypinata.cloud/ipfs/QmUAFzr4JvuvZH6dbVHGDCcVdVd3ka9C5Aiv3axJc34tfy",
  },
];

export default function CollectionPage() {
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const {
    selectedTabInnovation,
    setSelectedTabInnovation,
    collection,
    setCollection,
    nft,
    setNft,
    nftMetadata,
    setNftMetadata,
    collectionMetadata,
    setCollectionMetadata,
    metadataHash,
    setMetadataHash,
    ipfsHashes,
    setIpfsHashes,
    imageHash,
    setImageHash,
    imagesLinks,
    setImagesLinks,
    loading, setLoading
  } = useInnovationContext();

  const { toast } = useToast();

  const handleCollectionSelect = (
    e: React.MouseEvent<HTMLDivElement>,
    value: CollectionType
  ) => {
    e.preventDefault();
    try {
      setCollection(value);
      setLoading(true);
      toast({
        title: "Collection Selected",
        description: "Collection Selected",
        className: "bg-[#252525] text-white border-[#373737]",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Selected collection",
        description: "Select a Collection Type",
        variant: "destructive",
      });
    } finally {
      setLoading(false); 
    }
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
      setCollectionMetadata(metadataCid);

      return metadataCid;
    } catch (error) {
      console.error("Error uploading metadata:", error);
      return [];
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

  return (
    <div className="flex-1 overflow-y-auto  pb-24 bg-[#1C1A11]">
        {loading && <Loading />}
      <MaxWidthWrapper className="min-h-screen flex flex-col ">
        <main className="px-4 py-24">
          <div className="max-w-7xl mx-auto space-y-16">
            <ReusableHeading text="Intellectual Property Collection Types Selection" />
            <section className="space-y-8">
              <TypesComponent
                className="text-[#8A8A8A]"
                text="Select the type of intellectual property you want to protect. Each collection offers diferent ways to manage your proof of innovation."
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(COLLECTION_TYPES).map(([key, value]) => (
                  <VariousTypesButton
                    key={key}
                    isActive={activeButton === key}
                    className={`h-auto ${
                      activeButton === key
                        ? "border-[#FACC15] bg-[#373737]"
                        : "border-[#8A8A8A]"
                    } text-[#D0DFE4] hover:border-[#FACC15] hover:bg-[#373737]`}
                    width="full"
                    text={value.name}
                    detail={value.description}
                    onClick={(e) => handleCollectionSelect(e, value)} // Updated this line
                  />
                ))}
              </div>
            </section>

            {collection && (
              <section className="bg-[#252525] p-6 rounded-lg mt-8">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  Selected Collection
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-white">
                      <strong>Type:</strong> {collection.name}
                    </p>
                    <p className="text-white">
                      <strong>Description:</strong> {collection.description}
                    </p>
                    <p className="text-white">
                      <strong>Prefix:</strong> {collection.prefix}
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                    <img
                      src={collection.image}
                      alt={`${collection.name} logo`}
                      className="w-32 h-32 object-contain"
                    />
                  </div>
                </div>
              </section>
            )}

            <div className="flex justify-between items-center mt-16">
              <Link
                href="/dashboard"
                className="bg-transparent border border-[#D0DFE4] text-[#D0DFE4] px-6 py-2 rounded-lg hover:bg-[#FACC15] hover:text-[#1C1A11] hover:border-transparent transition-colors"
              >
                Cancel
              </Link>
            
              <ChainSelector/>
            </div>
          </div>
        </main>
      </MaxWidthWrapper>
    </div>
  );
}
