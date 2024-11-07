#![cfg_attr(not(feature = "std"), no_std)]

mod types;

#[frame_support::pallet(dev_mode)]
pub mod pallet {
    use crate::types::*;
    use frame_support::sp_runtime::traits::{AtLeast32BitUnsigned, One, Saturating, Zero};
    use frame_support::traits::ExistenceRequirement;
    use frame_support::{pallet_prelude::*, traits::Currency, traits::Hooks};
    use frame_system::pallet_prelude::*;
    use scale_info::prelude::format;
    use scale_info::prelude::string::String;
    use sp_std::prelude::*;
    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type Currency: Currency<Self::AccountId>;
        /// The type used to identify licenses
        type LicenseId: Member
            + Parameter
            + MaxEncodedLen
            + Copy
            + Default
            + From<u32>
            + AtLeast32BitUnsigned
            + One
            + TypeInfo;

        type NFTId: Member
            + Parameter
            + MaxEncodedLen
            + Copy
            + Default
            + From<u32>
            + AtLeast32BitUnsigned
            + One
            + TypeInfo;

        type Index: Member
            + Parameter
            + MaxEncodedLen
            + Copy
            + Default
            + From<u32>
            + AtLeast32BitUnsigned
            + One
            + TypeInfo;
        #[pallet::constant]
        type MaxNameLength: Get<u32>;
        #[pallet::constant]
        type MaxDescriptionLength: Get<u32>;
    }

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen, Debug)]
    #[scale_info(skip_type_params(T))]
    pub enum Offer<T: Config> {
        License(LicenseOffer<T>),
        Purchase(PurchaseOffer<T>),
    }
    #[pallet::storage]
    #[pallet::getter(fn nfts)]
    pub type Nfts<T: Config> = StorageMap<_, Blake2_128Concat, T::NFTId, NFT<T>>;

    #[pallet::storage]
    #[pallet::getter(fn next_nft_id)]
    pub type NextNftId<T: Config> = StorageValue<_, T::NFTId, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn next_offer_id)]
    pub type NextOfferId<T: Config> = StorageValue<_, T::LicenseId, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn offers)]
    pub type Offers<T: Config> = StorageMap<_, Blake2_128Concat, T::LicenseId, Offer<T>>;

    #[pallet::storage]
    #[pallet::getter(fn active_contracts)]
    pub type ActiveContracts<T: Config> =
        StorageMap<_, Blake2_128Concat, T::LicenseId, Contract<T>>;

    // This maps NFT -> Vec<LicenseId>
    // Helps us quickly check what active contracts exist for an NFT
    #[pallet::storage]
    pub type NFTContracts<T: Config> =
        StorageMap<_, Blake2_128Concat, T::NFTId, Vec<T::LicenseId>, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn escrow)]
    pub type Escrow<T: Config> =
        StorageMap<_, Blake2_128Concat, T::NFTId, (T::AccountId, BalanceOf<T>)>;

    #[pallet::storage]
    pub type EscrowedNfts<T: Config> = StorageMap<_, Blake2_128Concat, T::NFTId, T::AccountId>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        NftMinted {
            owner: T::AccountId,
            nft_id: T::NFTId,
        },
        NftEscrowed {
            nft_id: T::NFTId,
            owner: T::AccountId,
            price: BalanceOf<T>,
        },

        LicenseExpired {
            license_id: T::LicenseId,
            nft_id: T::NFTId,
            licensee: T::AccountId,
        },

        PeriodicPaymentFailed {
            license_id: T::LicenseId,
            nft_id: T::NFTId,
            licensee: T::AccountId,
            amount: BalanceOf<T>,
        },
        LicenseOffered {
            nft_id: T::NFTId,
            offer_id: T::LicenseId,
            licensor: T::AccountId,
            is_exclusive: bool,
        },
        PurchaseOffered {
            nft_id: T::NFTId,
            offer_id: T::LicenseId,
            seller: T::AccountId,
        },
        LicenseAccepted {
            license_id: T::LicenseId,
            licensee: T::AccountId,
        },
        LicenseRevoked {
            license_id: T::LicenseId,
            nft_id: T::NFTId,
            licensee: Option<T::AccountId>,
            reason: RevokeReason,
        },
        PeriodicPaymentProcessed {
            license_id: T::LicenseId,
            nft_id: T::NFTId,
            payer: T::AccountId,
            licensor: T::AccountId,
            amount: BalanceOf<T>,
        },
        LicenseCompleted {
            license_id: T::LicenseId,
            nft_id: T::NFTId,
            licensee: T::AccountId,
        },
        PaymentProcessed {
            payer: T::AccountId,
            payee: T::AccountId,
            amount: BalanceOf<T>,
        },
        PurchaseCompleted {
            offer_id: T::LicenseId,
            nft_id: T::NFTId,
            buyer: T::AccountId,
            seller: T::AccountId,
        },
        PeriodicPurchaseStarted {
            offer_id: T::LicenseId,
            contract_id: T::LicenseId,
            nft_id: T::NFTId,
            buyer: T::AccountId,
            seller: T::AccountId,
            first_payment: BalanceOf<T>,
        },
    }

    #[pallet::error]
    pub enum Error<T> {
        NameTooLong,
        DescriptionTooLong,
        FilingDateTooLong,
        JurisdictionTooLong,
        NftNotFound,
        NotNftOwner,
        NftAlreadyEscrowed,
        LicenseNotFound,
        LicenseNotOffered,
        LicenseOwnershipNotFound,
        AlreadyLicensed,
        NotLicenseOwner,
        LicenseNotRevocable,
        NftInEscrow,
        ActiveLicensesExist,
        ExclusiveLicenseExists,
        PaymentFailed,
        LicenseeNotFound,
        LicenseNotActive,
        NotLicensee,
        ZeroPayment,
        OfferNotFound,
        NotAPurchaseOffer,
        PaymentNotDue,
        PaymentNotCompleted,
        NotPeriodicPayment,
        ContractNotFound,
        LicenseNotExpired,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(10_000)]
        #[pallet::call_index(0)]
        pub fn mint_nft(
            origin: OriginFor<T>,
            name: String,
            description: String,
            filing_date: String,
            jurisdiction: String,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            let bounded_name: BoundedVec<u8, T::MaxNameLength> = name
                .as_bytes()
                .to_vec()
                .try_into()
                .map_err(|_| Error::<T>::NameTooLong)?;

            let bounded_description: BoundedVec<u8, T::MaxDescriptionLength> = description
                .as_bytes()
                .to_vec()
                .try_into()
                .map_err(|_| Error::<T>::DescriptionTooLong)?;

            let current_block = <frame_system::Pallet<T>>::block_number();
            let filing_date_with_block = format!("{} (Block: {:?})", filing_date, current_block);
            let bounded_filing_date: BoundedVec<u8, T::MaxNameLength> = filing_date_with_block
                .as_bytes()
                .to_vec()
                .try_into()
                .map_err(|_| Error::<T>::FilingDateTooLong)?;

            let bounded_jurisdiction: BoundedVec<u8, T::MaxNameLength> = jurisdiction
                .as_bytes()
                .to_vec()
                .try_into()
                .map_err(|_| Error::<T>::JurisdictionTooLong)?;

            let id = Self::next_nft_id();
            NextNftId::<T>::put(id.saturating_add(T::NFTId::one()));

            let nft = NFT {
                id,
                owner: who.clone(),
                name: bounded_name.clone(),
                description: bounded_description,
                filing_date: bounded_filing_date,
                jurisdiction: bounded_jurisdiction,
            };

            Nfts::<T>::insert(id, nft);

            Self::deposit_event(Event::NftMinted {
                owner: who,
                nft_id: id,
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(1)]
        pub fn escrow_nft(
            origin: OriginFor<T>,
            nft_id: T::NFTId,
            price: BalanceOf<T>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            let nft = Nfts::<T>::get(nft_id).ok_or(Error::<T>::NftNotFound)?;
            ensure!(nft.owner == who, Error::<T>::NotNftOwner);
            ensure!(
                !Escrow::<T>::contains_key(nft_id),
                Error::<T>::NftAlreadyEscrowed
            );

            Escrow::<T>::insert(nft_id, (who.clone(), price));

            Self::deposit_event(Event::NftEscrowed {
                nft_id,
                owner: who,
                price,
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(2)]
        pub fn offer_license(
            origin: OriginFor<T>,
            nft_id: T::NFTId,
            payment_type: PaymentType<T>,
            is_exclusive: bool,
            duration: BlockNumberFor<T>,
        ) -> DispatchResult {
            let licensor = ensure_signed(origin)?;

            // Ensure caller owns the NFT
            let nft = Nfts::<T>::get(nft_id).ok_or(Error::<T>::NftNotFound)?;
            ensure!(nft.owner == licensor, Error::<T>::NotNftOwner);

            // Check if there's an escrow for this NFT

            ensure!(
                !EscrowedNfts::<T>::contains_key(nft_id),
                Error::<T>::NftInEscrow
            );

            let existing_contracts = NFTContracts::<T>::get(nft_id);
            if is_exclusive {
                ensure!(
                    existing_contracts.is_empty(),
                    Error::<T>::ActiveLicensesExist
                )
            } else {
                for contract_id in existing_contracts {
                    if let Some(Contract::License(license)) = ActiveContracts::<T>::get(contract_id)
                    {
                        if license.is_exclusive {
                            return Err(Error::<T>::ExclusiveLicenseExists.into());
                        }
                    }
                }
            }

            let offer = Offer::License(LicenseOffer {
                nft_id,
                licensor: licensor.clone(),
                payment_type,
                is_exclusive,
                duration,
            });

            // Get and increment offer ID
            let offer_id = NextOfferId::<T>::get();
            NextOfferId::<T>::set(offer_id.saturating_add(T::LicenseId::one()));

            // Store offer
            Offers::<T>::insert(offer_id, offer);

            // Emit event
            Self::deposit_event(Event::LicenseOffered {
                offer_id,
                nft_id,
                licensor,
                is_exclusive,
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(3)]
        pub fn offer_purchase(
            origin: OriginFor<T>,
            nft_id: T::NFTId,
            payment_type: PaymentType<T>,
        ) -> DispatchResult {
            let seller = ensure_signed(origin)?;

            // Ensure caller owns the NFT
            let nft = Nfts::<T>::get(nft_id).ok_or(Error::<T>::NftNotFound)?;
            ensure!(nft.owner == seller, Error::<T>::NotNftOwner);
            // Ensure NFT not in escrow
            ensure!(
                !EscrowedNfts::<T>::contains_key(nft_id),
                Error::<T>::NftInEscrow
            );

            // Check no active licenses exist
            let existing_contracts = NFTContracts::<T>::get(nft_id);
            ensure!(
                existing_contracts.is_empty(),
                Error::<T>::ActiveLicensesExist
            );

            let offer = Offer::Purchase(PurchaseOffer {
                nft_id,
                seller: seller.clone(),
                payment_type,
            });

            // Get and increment offer ID
            let offer_id = NextOfferId::<T>::get();
            NextOfferId::<T>::set(offer_id.saturating_add(T::LicenseId::one()));

            // Store offer
            Offers::<T>::insert(offer_id, offer);

            // Emit event
            Self::deposit_event(Event::PurchaseOffered {
                offer_id,
                nft_id,
                seller,
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(4)]
        pub fn accept_license(origin: OriginFor<T>, offer_id: T::LicenseId) -> DispatchResult {
            let licensee = ensure_signed(origin)?;

            // Get and validate offer
            let offer = Offers::<T>::get(offer_id).ok_or(Error::<T>::LicenseNotOffered)?;

            let license_offer = match offer {
                Offer::License(o) => o,
                _ => return Err(Error::<T>::LicenseNotOffered.into()),
            };

            // Handle payment
            match &license_offer.payment_type {
                PaymentType::OneTime(amount) => {
                    Self::process_payment(&licensee, &license_offer.licensor, amount.clone())?;
                }
                PaymentType::Periodic {
                    amount_per_payment, ..
                } => {
                    Self::process_payment(
                        &licensee,
                        &license_offer.licensor,
                        amount_per_payment.clone(),
                    )?;
                }
            }

            // Create active license
            let active_license = license_offer.init(licensee.clone());

            ActiveContracts::<T>::insert(offer_id, Contract::License(active_license.clone()));
            NFTContracts::<T>::append(&active_license.nft_id, offer_id);

            // If exclusive, remove offer
            if active_license.is_exclusive {
                Offers::<T>::remove(offer_id);
            }

            // Emit event
            Self::deposit_event(Event::LicenseAccepted {
                license_id: offer_id,
                licensee,
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(5)]
        pub fn accept_purchase(origin: OriginFor<T>, offer_id: T::LicenseId) -> DispatchResult {
            let buyer = ensure_signed(origin)?;

            // Get and validate offer
            let offer = Offers::<T>::get(offer_id).ok_or(Error::<T>::OfferNotFound)?;

            let purchase_offer = match offer {
                Offer::Purchase(o) => o,
                _ => return Err(Error::<T>::NotAPurchaseOffer.into()),
            };

            // Ensure NFT not already in escrow
            ensure!(
                !EscrowedNfts::<T>::contains_key(&purchase_offer.nft_id),
                Error::<T>::NftInEscrow
            );

            match purchase_offer.payment_type {
                PaymentType::OneTime(amount) => {
                    // Process full payment
                    Self::process_payment(&buyer, &purchase_offer.seller, amount.clone())?;

                    // Transfer NFT ownership
                    Nfts::<T>::mutate(purchase_offer.nft_id, |maybe_nft| {
                        if let Some(nft) = maybe_nft {
                            nft.owner = buyer.clone();
                        }
                    });

                    // Remove offer
                    Offers::<T>::remove(offer_id);

                    // Emit event
                    Self::deposit_event(Event::PurchaseCompleted {
                        offer_id,
                        nft_id: purchase_offer.nft_id,
                        buyer,
                        seller: purchase_offer.seller,
                    });
                }
                PaymentType::Periodic {
                    amount_per_payment, ..
                } => {
                    // Process first payment
                    Self::process_payment(
                        &buyer,
                        &purchase_offer.seller,
                        amount_per_payment.clone(),
                    )?;

                    // Put NFT in escrow
                    EscrowedNfts::<T>::insert(&purchase_offer.nft_id, &purchase_offer.seller);

                    // Create active purchase contract
                    let active_purchase = purchase_offer.init(buyer.clone());

                    ActiveContracts::<T>::insert(
                        offer_id,
                        Contract::Purchase(active_purchase.clone()),
                    );
                    NFTContracts::<T>::append(&active_purchase.nft_id, offer_id);

                    // Remove offer
                    Offers::<T>::remove(offer_id);

                    // Emit event
                    Self::deposit_event(Event::PeriodicPurchaseStarted {
                        offer_id,
                        contract_id: offer_id,
                        nft_id: active_purchase.nft_id,
                        buyer,
                        seller: active_purchase.seller,
                        first_payment: amount_per_payment,
                    });
                }
            }

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(7)]
        pub fn make_periodic_payment(
            origin: OriginFor<T>,
            contract_id: T::LicenseId,
        ) -> DispatchResult {
            let payer = ensure_signed(origin)?;

            // Get and validate contract exists
            let contract =
                ActiveContracts::<T>::get(contract_id).ok_or(Error::<T>::LicenseNotFound)?;

            match contract {
                Contract::License(mut license) => {
                    // Ensure license is active
                    ensure!(
                        license.status == LicenseStatus::Active,
                        Error::<T>::LicenseNotActive
                    );

                    // Get payment details
                    let (amount, frequency, schedule) =
                        match (&license.payment_type, &mut license.payment_schedule) {
                            (
                                PaymentType::Periodic {
                                    amount_per_payment,
                                    frequency,
                                    ..
                                },
                                Some(schedule),
                            ) => {
                                // Ensure payment is due
                                let current_block = frame_system::Pallet::<T>::block_number();
                                ensure!(
                                    current_block >= schedule.next_payment_block
                                        && schedule.payments_due > 0u32.into(),
                                    Error::<T>::PaymentNotDue
                                );

                                (*amount_per_payment, *frequency, schedule)
                            }
                            _ => return Err(Error::<T>::NotPeriodicPayment.into()),
                        };

                    // Process payment
                    Self::process_payment(&payer, &license.licensor, amount)?;

                    // Update payment schedule
                    schedule.payments_made += 1u32.into();
                    schedule.payments_due -= 1u32.into();
                    schedule.next_payment_block += frequency;

                    // Update contract
                    ActiveContracts::<T>::insert(contract_id, Contract::License(license.clone()));

                    // Emit event
                    Self::deposit_event(Event::PeriodicPaymentProcessed {
                        license_id: contract_id,
                        amount,
                        licensor: license.licensor,
                        nft_id: license.nft_id,
                        payer,
                    });
                }

                Contract::Purchase(mut purchase) => {
                    // Ensure purchase is in progress
                    ensure!(
                        purchase.status == PurchaseStatus::InProgress,
                        Error::<T>::LicenseNotActive
                    );

                    // Get payment details
                    let (amount, frequency, schedule) =
                        match (&purchase.payment_type, &mut purchase.payment_schedule) {
                            (
                                PaymentType::Periodic {
                                    amount_per_payment,
                                    frequency,
                                    ..
                                },
                                Some(schedule),
                            ) => {
                                // Ensure payment is due
                                let current_block = frame_system::Pallet::<T>::block_number();
                                ensure!(
                                    current_block >= schedule.next_payment_block,
                                    Error::<T>::PaymentNotDue
                                );

                                (*amount_per_payment, *frequency, schedule)
                            }
                            _ => return Err(Error::<T>::NotPeriodicPayment.into()),
                        };

                    // Process payment
                    Self::process_payment(&payer, &purchase.seller, amount)?;

                    // Update payment schedule
                    schedule.payments_made += 1u32.into();
                    schedule.payments_due -= 1u32.into();
                    schedule.next_payment_block += frequency;

                    // If this was the last payment, complete the purchase
                    if schedule.payments_due.is_zero() {
                        // Remove from escrow
                        EscrowedNfts::<T>::remove(&purchase.nft_id);

                        // Transfer NFT ownership
                        Nfts::<T>::mutate(purchase.nft_id, |maybe_nft| {
                            if let Some(nft) = maybe_nft {
                                nft.owner = payer.clone();
                            }
                        });

                        purchase.status = PurchaseStatus::Completed;
                    }

                    // Update contract
                    ActiveContracts::<T>::insert(contract_id, Contract::Purchase(purchase.clone()));

                    // Emit event
                    Self::deposit_event(Event::PeriodicPaymentProcessed {
                        license_id: contract_id,
                        amount,
                        licensor: purchase.seller,
                        nft_id: purchase.nft_id,
                        payer,
                    });
                }
            }

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(8)]
        pub fn expire_license(origin: OriginFor<T>, contract_id: T::LicenseId) -> DispatchResult {
            let _ = ensure_signed(origin)?;

            // Get and validate contract
            let contract =
                ActiveContracts::<T>::get(contract_id).ok_or(Error::<T>::ContractNotFound)?;

            let license = match contract {
                Contract::License(l) => l,
                Contract::Purchase(_) => return Err(Error::<T>::LicenseNotFound.into()),
            };

            // check if license is active
            ensure!(
                license.status == LicenseStatus::Active,
                Error::<T>::LicenseNotActive
            );

            // Check if license has expired
            let current_block = frame_system::Pallet::<T>::block_number();
            let expiry_block = license.start_block + license.duration;
            ensure!(current_block >= expiry_block, Error::<T>::LicenseNotExpired);

            // Remove contract
            ActiveContracts::<T>::remove(contract_id);

            // Remove from NFT contracts list
            NFTContracts::<T>::mutate(license.nft_id, |contracts| {
                contracts.retain(|&id| id != contract_id);
            });

            // Emit event
            Self::deposit_event(Event::LicenseExpired {
                license_id: contract_id,
                nft_id: license.nft_id,
                licensee: license.licensee,
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(9)]
        pub fn complete_purchase(
            origin: OriginFor<T>,
            contract_id: T::LicenseId,
        ) -> DispatchResult {
            let _ = ensure_signed(origin)?;

            // Get and validate contract
            let contract =
                ActiveContracts::<T>::get(contract_id).ok_or(Error::<T>::ContractNotFound)?;

            let purchase = match contract {
                Contract::Purchase(p) => p,
                Contract::License(_) => return Err(Error::<T>::NotAPurchaseOffer.into()),
            };

            // Ensure all payments have been made
            let schedule = purchase
                .payment_schedule
                .ok_or(Error::<T>::NotPeriodicPayment)?;
            ensure!(
                schedule.payments_due.is_zero(),
                Error::<T>::PaymentNotCompleted
            );

            // Remove from escrow
            EscrowedNfts::<T>::remove(&purchase.nft_id);

            // Transfer NFT ownership
            Nfts::<T>::mutate(purchase.nft_id, |maybe_nft| {
                if let Some(nft) = maybe_nft {
                    nft.owner = purchase.buyer.clone();
                }
            });

            // Remove contract
            ActiveContracts::<T>::remove(contract_id);

            // Remove from NFT contracts list
            NFTContracts::<T>::mutate(purchase.nft_id, |contracts| {
                contracts.retain(|&id| id != contract_id);
            });

            // Emit event
            Self::deposit_event(Event::PurchaseCompleted {
                offer_id: contract_id,
                nft_id: purchase.nft_id,
                buyer: purchase.buyer,
                seller: purchase.seller,
            });

            Ok(())
        }
    }

    impl<T: Config> Pallet<T> {
        /// Process a payment from payer to payee
        /// Returns Ok(()) if successful, Err if failed
        pub fn process_payment(
            payer: &T::AccountId,
            payee: &T::AccountId,
            amount: BalanceOf<T>,
        ) -> DispatchResult {
            // Ensure amount is not zero
            ensure!(!amount.is_zero(), Error::<T>::ZeroPayment);

            // Transfer the funds
            // Using the currency trait from Config
            T::Currency::transfer(
                payer,
                payee,
                amount,
                ExistenceRequirement::KeepAlive, // Prevent account deletion
            )?;

            // Emit payment event
            Self::deposit_event(Event::PaymentProcessed {
                payer: payer.clone(),
                payee: payee.clone(),
                amount: amount,
            });

            Ok(())
        }
    }

    // #[pallet::hooks]
    // impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
    //     fn on_initialize(n: BlockNumberFor<T>) -> Weight {
    //         let mut weight = T::DbWeight::get().reads(1);

    //         for (license_id, license) in Licenses::<T>::iter() {
    //             if license.status == LicenseStatus::Active {
    //                 weight =
    //                     weight.saturating_add(Self::process_active_license(license_id, license, n));
    //             }
    //         }

    //         weight
    //     }
    // }

    // impl<T: Config> Pallet<T> {
    //     fn process_active_license(
    //         license_id: T::LicenseId,
    //         mut license: License<T>,
    //         n: BlockNumberFor<T>,
    //     ) -> Weight {
    //         let mut weight = T::DbWeight::get().reads(1);




    //         // Process periodic payment if due
    //         if let PaymentType::Periodic { .. } = license.payment_type {
    //             if let Some(schedule) = &license.payment_schedule {
    //                 if n >= schedule.next_payment_block {
    //                     match Self::attempt_periodic_payment(license_id, &mut license) {
    //                         Ok(_) => {
    //                             weight =
    //                                 weight.saturating_add(T::DbWeight::get().reads_writes(1, 1));
    //                             // Update the license in storage
    //                             Licenses::<T>::insert(license_id, license);
    //                         }
    //                         Err(_) => {
    //                             // Payment failed, cancel the license
    //                             weight = weight
    //                                 .saturating_add(Self::cancel_license(license_id, &license));
    //                         }
    //                     }
    //                 }
    //             }
    //         }

    //         weight
    //     }

    //     pub(crate) fn attempt_periodic_payment(
    //         license_id: T::LicenseId,
    //         license: &mut License<T>,
    //     ) -> DispatchResult {
    //         let (amount_per_payment, total_payments, frequency) = match &license.payment_type {
    //             PaymentType::Periodic {
    //                 amount_per_payment,
    //                 total_payments,
    //                 frequency,
    //             } => (*amount_per_payment, *total_payments, *frequency),
    //             _ => return Err(Error::<T>::PaymentFailed.into()),
    //         };

    //         let schedule = license
    //             .payment_schedule
    //             .as_mut()
    //             .ok_or(Error::<T>::PaymentFailed)?;
    //         let licensee = license
    //             .licensee
    //             .as_ref()
    //             .ok_or(Error::<T>::LicenseeNotFound)?;
    //         let licensor = license.licensor.clone();
    //         let nft_id = license.nft_id;

    //         T::Currency::transfer(
    //             licensee,
    //             &licensor,
    //             amount_per_payment,
    //             ExistenceRequirement::KeepAlive,
    //         )
    //         .map_err(|_| {
    //             Self::deposit_event(Event::PeriodicPaymentFailed {
    //                 license_id,
    //                 nft_id,
    //                 licensee: licensee.clone(),
    //                 amount: amount_per_payment,
    //             });
    //             Error::<T>::PaymentFailed
    //         })?;

    //         // Update schedule and other logic...
    //         schedule.payments_made = schedule.payments_made.saturating_add(T::Index::one());
    //         schedule.payments_due = schedule.payments_due.saturating_sub(T::Index::one());
    //         schedule.next_payment_block += frequency;

    //         Self::deposit_event(Event::PeriodicPaymentProcessed {
    //             license_id,
    //             nft_id,
    //             payer: licensee.clone(),
    //             licensor,
    //             amount: amount_per_payment,
    //         });

    //         if schedule.payments_made == total_payments {
    //             license.status = LicenseStatus::Completed;
    //             Self::deposit_event(Event::LicenseCompleted {
    //                 license_id,
    //                 nft_id,
    //                 licensee: licensee.clone(),
    //             });
    //         }

    //         Ok(())
    //     }
    // }
}

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;
