## SOFTLAW - The Intellectual Property Chain Secured By Polkadot.

## Description 
Intellectual Property AppChain, allows cientist,  builders to protect their Intellectual with Proof of Creations & Manage their Ip Licenses with Smart Legal Contracts.

# IP Pallet
An intellectual Property Pallet

NFT Licensing System
1. NFT Licensing
As an NFT creator (licensor), I can offer licenses for my NFTs to potential licensees.
As a licensee, I can accept offered licenses for NFTs I'm interested in using.
2. Payment Handling
As a licensor, I can set up recurring payments for my NFT licenses.
As a licensee, I can make scheduled payments for the NFTs I've licensed.
The system automatically handles payment transfers between licensors and licensees.
3. License Management
As a licensor, I can revoke licenses under certain conditions (e.g., before any payments are made).
4. Escrow and Conditional Transfers
The system acts as an escrow service, holding the NFT until license conditions are met.
When a license expires or is fully paid, the NFT can be automatically transferred to the licensee.
5. Contract Enforcement
The system enforces the terms of the license contract, including payment schedules and rights.
If a licensee fails to make payments, the system can automatically revoke the license.
6. Transparency and Tracking
Users can view the current status of any license, including payment history and remaining duration.
The system maintains a clear record of all license transactions and transfers.

# Overview Mental Map 
[image]

# General Extrinsics
1. Encode.
2. Decode.
3. Attestate.

# Extrinsics Proof of Creation
3. Mint_ip_collection
4. Mint_ip_nft
5. Mint_child_nft
6. Add_child_nft
7. Attestate_nft
8. Attestate_child_nft

# Extrinsics Users Identity
1. Mint_idendity
2. Attestate_identity

# Extrinsics Escrow legal Contracts
7. Mint_terms_&_conditions
8. Mint_escrow



# Data Structure.
[image]

# Team
- Mario Andrade: CEO
- Baruch (Luke) Fishman: Tech Lead & Polkadot Dev
- Favour Chiksze: Front End Dev
- Pat Sinma: Product Designer
- Ganesh: Polkadot Dev


# Instalation softlaw_chain

1. Run Softlaw_Chain
2. Install Pop Network
3. Pop build --release
4. pop up parachain -f network.toml
5. Interact with the Intellectual Property Pallet
