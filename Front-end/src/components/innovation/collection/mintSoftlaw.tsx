import { useToast } from "@/hooks/use-toast";
import CollectionTypes from "@/utils/collectionTypes.json";
import { useInnovationContext } from "@/context/innovation";
import { getApi } from "@/utils/getApi";
import { getSigner } from "@/utils/getSigner";

interface CollectionCreatedEvent {
  name: string;
  values: {
    collectionAddress: string;
  };
}

export default function MintSoftlawCollection() {
  const {
    uniqueCollectionAddress,
    setUniqueCollectionAddress,
    setLoading,
    collection,
    setCollection,
    loading,
    setSelectedTabInnovation,
  } = useInnovationContext();


  const { toast } = useToast();

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

  const handleMintCollection = async () => {
    if (!collection) {
      toast({
        title: "Error Collection",
        description: "Select a Collection",
        variant: "destructive",
      });
      return;
    }
    try {
      setLoading(true);

    //   let signer = await getSigner();
      //   let subAddr = signer?.address ?? "";
      //   const ethMirror = Address.mirror.substrateToEthereum(subAddr);
      //   const sdk = await getUniqueSDK(signer);
      let Api = await getApi();

    //   const tx = await Api.tx.call({});

    //   if (tx?.parsed?.parsedEvents && tx?.parsed.parsedEvents.length > 0) {
    //     const event = tx.parsed.parsedEvents.find(
    //       (e) => e.name === "CollectionCreated"
    //     ) as CollectionCreatedEvent;

    //     if (event && event.values && event.values.collectionAddress) {
    //       const collectionAddr = event.values.collectionAddress;
    //       setUniqueCollectionAddress(collectionAddr);

    //       toast({
    //         title: "Collection Created",
    //         description: `Successfully created collection at address: ${collectionAddr}`,
    //         variant: "default",
    //         className: "bg-white text-black border border-gray-200",
    //       });
    //     } else {
    //       console.error("CollectionCreated event not found.");
    //       toast({
    //         title: "Error Collection",
    //         description: "CollectionCreated event not found.",
    //         variant: "destructive",
    //       });
    //     }
    //   } else {
    //     console.error("No parsed events found in the transaction receipt.");
    //     toast({
    //       title: "Error Collection",
    //       description: "No parsed events found in the transaction receipt.",
    //       variant: "destructive",
    //     });
    //   }
    console.log("Api: ", Api);
    } catch (error) {
      console.error("Error during transaction:", error);
      toast({
        title: "Error Collection",
        description: `Error during collection creation transaction ${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSelectedTabInnovation("2");
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
      Mint Collection with Softlaw
    </button>
  );
}
