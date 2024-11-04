import { createContext, useContext, useState, ReactNode } from "react";

interface InnovationTapContextType {
  selectedTabInnovation: string;
  setSelectedTabInnovation: React.Dispatch<React.SetStateAction<string>>;
}

const defaultContextValue: InnovationTapContextType = {
  selectedTabInnovation: "1",
  setSelectedTabInnovation: () => {},
};

const InnovationTabContext =
  createContext<InnovationTapContextType>(defaultContextValue);

export function useInnovationTapContext() {
  const context = useContext(InnovationTabContext);
  if (context === undefined) {
    throw new Error(
      "useInnovationTapContext must be used within an InnovationTabProvider"
    );
  }
  return context;
}

interface InnovationTabProviderProps {
  children: ReactNode;
}

export default function InnovationProvider({
  children,
}: InnovationTabProviderProps) {
  const [selectedTabInnovation, setSelectedTabInnovation] = useState<string>("1");
  const value: InnovationTapContextType = {
    selectedTabInnovation,
    setSelectedTabInnovation,
  };

  return (
    <InnovationTabContext.Provider value={value}>
      {children}
    </InnovationTabContext.Provider>
  );
}
