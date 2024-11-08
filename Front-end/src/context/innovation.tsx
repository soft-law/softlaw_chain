import React, { createContext, useContext, useState, ReactNode } from "react";

interface CollectionType {
  name: string;
  description: string;
  prefix: string;
  image: string;
}

interface NftType {
  name: string;
  description: string;
  metadata: string;
}

interface InnovationContextType {
  selectedTabInnovation: string;
  setSelectedTabInnovation: React.Dispatch<React.SetStateAction<string>>;
  collection: CollectionType |null ;
  setCollection: React.Dispatch<React.SetStateAction<CollectionType | null>>;
  nft: NftType | null;
  setNft: React.Dispatch<React.SetStateAction<NftType | null>>;
}

const defaultContextValue: InnovationContextType = {
  selectedTabInnovation: "1",
  setSelectedTabInnovation: () => {},
  collection: null,
  setCollection: () => {},
  nft: null,
  setNft: () => {},
};

const InnovationContext =
  createContext<InnovationContextType>(defaultContextValue);

export function useInnovationContext() {
  const context = useContext(InnovationContext);
  if (context === undefined) {
    throw new Error(
      "useInnovationContext must be used within an InnovationProvider"
    );
  }
  return context;
}

interface InnovationProviderProps {
  children: ReactNode;
}

export default function InnovationProvider({
  children,
}: InnovationProviderProps) {
  const [selectedTabInnovation, setSelectedTabInnovation] =
    useState<string>("1");
  const [collection, setCollection] = useState<CollectionType | null>(null);
  const [nft, setNft] = useState<NftType | null>(null);
  const value: InnovationContextType = {
    selectedTabInnovation,
    setSelectedTabInnovation,
    collection,
    setCollection,
    nft,
    setNft,
  };

  return (
    <InnovationContext.Provider value={value}>
      {children}
    </InnovationContext.Provider>
  );
}
