import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAccountsContext } from "@/context/account";
import { useInnovationContext } from "@/context/innovation";

// interface CollectionType {
//   name: string;
//   description: string;
//   image: string;
// }
interface ButtonMintCollectionProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  // collection: CollectionType;
}


export default function ButtonMintCollection({
  loading,
  setLoading,
}: ButtonMintCollectionProps) {
  const {collection, setCollection} = useInnovationContext()
  const { toast } = useToast();
  const router = useRouter();
  const { selectedAccount } = useAccountsContext();

  const {setSelectedTabInnovation, selectedTabInnovation} = useInnovationContext()

  const handleNext = async () => {
    try {
      setSelectedTabInnovation("2");
      console.log("test", selectedTabInnovation);
    } catch (e) {
      console.log(e);
    }
  };

  const handleMintCollection = async () => {
    try {
      console.log(
        "Minting collection...",
        collection,
        "with account",
        selectedAccount
      );

      if (!collection?.name || !collection?.description || !collection.image) {
        toast({
          title: "Error minting collection",
          description: "Select a Collection Type",
          variant: "destructive",
        });
        return;
      }
      if (!selectedAccount) {
        toast({
          title: "Error minting collection",
          description: "Connect Your Wallet",
          variant: "destructive",
        });
        return;
      }
      setLoading(true);
      // Mint logic here
      alert(selectedAccount);
      console.log("Minting collection...", collection);

      toast({
        title: "Collection minted successfully",
        description: "Your collection has been created",
        className: "bg-[#252525] text-white border-[#373737]",
      });

      const pinataUrl = "https://copper-ready-guanaco-464.mypinata.cloud/ipfs/";

      console.log(collection, pinataUrl);

      setSelectedTabInnovation("2");

      // router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error minting collection",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={
        "bg-[#D0DFE4] text-[#1C1A11] px-6 py-2 rounded-lg hover:bg-[#FACC15] transition-colors disabled:opacity-50"
      }
      onClick={handleMintCollection}
      disabled={loading}
    >
      {loading ? "Minting..." : "Mint Collection"}
    </button>
  );
}
