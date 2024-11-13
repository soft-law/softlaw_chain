"use client";
import { useToast } from "@/hooks/use-toast";
import { useInnovationContext } from "@/context/innovation";
import { useAccountsContext } from "@/context/account";
import { web3Enable, web3FromAddress } from "@polkadot/extension-dapp";
import { getSoftlawApi } from "@/utils/softlaw/getApi";
import { stringToHex } from '@polkadot/util';

interface MintResult {
    collectionId: string;
    creator: string;
    owner: string;
    blockHash: string;
}

export default function MintNftButton() {
    const {
        nftMetadata,
        setLoading,
        loading
    } = useInnovationContext();

    const { selectedAccount } = useAccountsContext();
    const { toast } = useToast();

    const validateMetadata = () => {
        if (!nftMetadata) {
            throw new Error("NFT metadata is not defined");
        }

        if (!nftMetadata.name || !nftMetadata.description || 
            !nftMetadata.useDate || !nftMetadata.registryNumber) {
            throw new Error("Missing required fields in metadata");
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(nftMetadata.useDate)) {
            throw new Error('Use date must be in YYYY-MM-DD format');
        }
    };

    const mintNFT = async (): Promise<MintResult> => {
        validateMetadata();

        let api = await getSoftlawApi();
        await web3Enable("softlaw");

        if (!selectedAccount?.address) {
            throw new Error("No selected account");
        }

        const addr = selectedAccount.address;

        return new Promise(async (resolve, reject) => {
            try {
                console.log("Starting NFT minting with metadata:", nftMetadata);

                // Convertir strings a hex con prefijo 0x
                const nameHex = stringToHex(nftMetadata.name);
                const descriptionHex = stringToHex(nftMetadata.description);
                const filingDateHex = stringToHex(nftMetadata.useDate);
                const jurisdictionHex = stringToHex(nftMetadata.registryNumber);

                console.log("Hex values:", {
                    name: nameHex,
                    description: descriptionHex,
                    filingDate: filingDateHex,
                    jurisdiction: jurisdictionHex
                });

                const injector = await web3FromAddress(addr);
                if (!injector?.signer) {
                    throw new Error("No signer found");
                }

                api.setSigner(injector.signer as any);

                // Crear la transacción usando los valores hex
                const tx = api.tx.ipPallet.mintNft(
                    nameHex,
                    descriptionHex,
                    filingDateHex,
                    jurisdictionHex
                );

                console.log("Transaction hex:", tx.method.toHex());

                const unsub = await tx.signAndSend(
                    addr,
                    { signer: injector.signer as any },
                    ({ status, events, dispatchError }) => {
                        if (dispatchError) {
                            if (dispatchError.isModule) {
                                try {
                                    const decoded = api.registry.findMetaError(dispatchError.asModule);
                                    const { docs, name, section } = decoded;
                                    reject(new Error(`${section}.${name}: ${docs.join(" ")}`));
                                } catch (err) {
                                    reject(new Error("Failed to decode error"));
                                }
                            } else {
                                reject(new Error(dispatchError.toString()));
                            }
                            unsub();
                            return;
                        }

                        if (status.isInBlock || status.isFinalized) {
                            events.forEach(({ event }) => {
                                if (event.section === 'ipPallet' && event.method === 'NftMinted') {
                                    resolve({
                                        collectionId: event.data[0].toString(),
                                        creator: addr,
                                        owner: addr,
                                        blockHash: status.isInBlock ? 
                                            status.asInBlock.toString() : 
                                            status.asFinalized.toString()
                                    });
                                }
                            });

                            if (status.isFinalized) {
                                unsub();
                            }
                        }
                    }
                );
            } catch (error) {
                console.error("Error in minting NFT:", error);
                reject(error instanceof Error ? error : new Error('Unknown error occurred'));
            }
        });
    };

    const handleMint = async () => {
        try {
            setLoading(true);
            const result = await mintNFT();
            toast({
                title: "Success",
                description: `NFT minted with ID: ${result.collectionId}`,
                variant: "default",
            });
        } catch (error) {
            console.error("Mint error:", error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to mint NFT",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className="mt-4 text-white hover:bg-white hover:text-blue-500 border border-yellow-400 rounded px-4 py-2"
            onClick={handleMint}
            disabled={loading}
        >
            {loading ? "Minting..." : "Mint NFT"}
        </button>
    );
}