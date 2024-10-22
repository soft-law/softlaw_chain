# SOFTLAW - The Intellectual Property Chain Secured by Polkadot
![Alt text](https://harlequin-quiet-smelt-978.mypinata.cloud/ipfs/QmdWWR5frGwGDYBdJWagXhP3QpxFEoRz9Xmk5CNQnPjs1s)

## Description
Softlaw is an Intellectual Property (IP) AppChain designed to empower scientists, builders, and creators to secure their intellectual creations through **Proof of Innovation** and manage their IP licenses using **Smart Legal Contracts aka Ricardian Contracts**. Built on the Polkadot ecosystem, Softlaw ensures secure and transparent handling of IP rights and licensing.

## What We Built for the Hackathon

1. **Intellectual Property Chain**: A blockchain specifically tailored for managing intellectual property licenses and registries.
2. **Intellectual Property Pallet**: A custom Substrate pallet to manage the creation, licensing, and protection of NFTs representing intellectual property.
3. **Onboarding Process to Paseo Network**: We reserve a slot to be a parachain in Paseo Network. This is our pull request for para_id:
4. **Front-End Interface**: A user-friendly interface for interacting with the Softlaw platform.

## Intellectual Property Pallet Overview

### NFT Licensing System

1. **NFT Licensing**:  
   - *As a licensor*, offer licenses for your NFTs to potential licensees.  
   - *As a licensee*, accept offered licenses for NFTs you're interested in using.

2. **Payment Handling**:  
   - *As a licensor*, set up recurring payments for your NFT licenses.  
   - *As a licensee*, make scheduled payments for licensed NFTs.  
   - The system automatically manages payment transfers between licensors and licensees.

3. **License Management**:  
   - *As a licensor*, revoke licenses under specific conditions (e.g., before any payments are made).

4. **Escrow and Conditional Transfers**:  
   - The system acts as an escrow, holding NFTs until licensing conditions are met.  
   - Upon license expiration or full payment, NFTs are automatically transferred to the licensee.

5. **Contract Enforcement**:  
   - The system enforces license terms, including payment schedules and user rights.  
   - If a licensee fails to make payments, the system can automatically revoke the license.

6. **Transparency and Tracking**:  
   - Users can track the status of licenses, including payment history and remaining duration.  
   - The system maintains a clear record of all transactions and transfers.

## Overview Mental Map
*(Include an image of the mental map here)*

## Data Structure
*(Include an image of the data structure here)*

## Team
- **Mario Andrade**: CEO
- **Luke Barush**: Tech Lead & Polkadot Developer
- **Favour Chiksze**: Front-End Developer
- **Pat Sinma**: Product Designer
- **Ganesh**: Polkadot Developer

## Installation Guide

### Setting Up Softlaw Chain

1. Clone the repository and navigate to the project directory.
2. Install the required dependencies.
3. Build the chain:
   pop build --release
4. pop up parachain -f network.toml

### Interact with the Intellectual Property Pallet through the provided UI.
Running the Front-End
Ensure that the Softlaw Chain is running.
Navigate to the front-end directory.


## Pitch Deck
Find our comprehensive pitch deck here:
https://harlequin-quiet-smelt-978.mypinata.cloud/ipfs/QmQtXZZnFzSwt4zoAVWwsUu111Yuwcu2121TBpUz4rfece

## Web
Visit our website: https://soft.law/

## Track
Track: Building a blockchain with the Polkadot SDK.

## Bounty
Bounty: Blockchain for Good - Leveraging blockchain technology to protect intellectual property and support creators worldwide.
