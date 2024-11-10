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

        type OfferId: Member
            + Parameter
            + MaxEncodedLen
            + Copy
            + Default
            + From<u32>
            + AtLeast32BitUnsigned
            + One
            + TypeInfo;

        type ContractId: Member
            + Parameter
            + MaxEncodedLen
            + Copy
            + Default
            + From<u32>
            + From<Self::OfferId>
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
            + Into<BalanceOf<Self>>
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

    #[pallet::storage]
    #[pallet::getter(fn nfts)]
    pub type Nftss<T: Config> = StorageMap<_, Blake2_128Concat, T::NFTId, NFT<T>>;

    #[pallet::storage]
    #[pallet::getter(fn next_nft_id)]
    pub type NextNftId<T: Config> = StorageValue<_, T::NFTId, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn next_offer_id)]
    pub type NextOfferId<T: Config> = StorageValue<_, T::OfferId, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn offers)]
    pub type Offers<T: Config> = StorageMap<_, Blake2_128Concat, T::OfferId, Offer<T>>;

    #[pallet::storage]
    #[pallet::getter(fn contracts)]
    pub type Contracts<T: Config> = StorageMap<_, Blake2_128Concat, T::ContractId, Contract<T>>;

    // This maps NFT -> Vec<LicenseId>
    // Helps us quickly check what active contracts exist for an NFT
    #[pallet::storage]
    #[pallet::getter(fn nft_contracts)]
    pub type NFTContracts<T: Config> =
        StorageMap<_, Blake2_128Concat, T::NFTId, Vec<T::ContractId>, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn escrowed_nfts)]
    pub type EscrowedNfts<T: Config> = StorageMap<_, Blake2_128Concat, T::NFTId, T::AccountId>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        // NFT Creation & Ownership Events
        NftMinted {
            owner: T::AccountId,
            nft_id: T::NFTId,
        },
        NftEscrowed {
            nft_id: T::NFTId,
            owner: T::AccountId,
        },
        NftRemovedFromEscrow {
            nft_id: T::NFTId,
            owner: T::AccountId,
        },

        // Offer Creation Events
        LicenseOffered {
            nft_id: T::NFTId,
            offer_id: T::OfferId,
            is_exclusive: bool,
        },
        PurchaseOffered {
            nft_id: T::NFTId,
            offer_id: T::OfferId,
        },

        // License Events
        LicenseAccepted {
            offer_id: T::OfferId,
            licensee: T::AccountId,
        },

        // Purchase Events
        PeriodicPurchaseStarted {
            offer_id: T::OfferId,
            nft_id: T::NFTId,
            buyer: T::AccountId,
            seller: T::AccountId,
        },
        ContractCompleted {
            contract_id: T::ContractId,
            contract_type: ContractType,
            nft_id: T::NFTId,
            offered_by: T::AccountId,
            accepted_by: T::AccountId,
            total_paid: BalanceOf<T>,
        },

        ContractExpired {
            contract_id: T::ContractId,
            contract_type: ContractType,
            nft_id: T::NFTId,
            offered_by: T::AccountId,
            accepted_by: T::AccountId,
            payments_made: T::Index,
            total_paid: BalanceOf<T>,
        },

        // Payment Events
        PaymentMade {
            payer: T::AccountId,
            payee: T::AccountId,
            amount: BalanceOf<T>,
        },
        PeriodicPaymentMade {
            contract_id: T::ContractId,
            nft_id: T::NFTId,
            payer: T::AccountId,
            payee: T::AccountId,
            amount: BalanceOf<T>,
        },
        PeriodicPaymentFailed {
            contract_id: T::ContractId,
            nft_id: T::NFTId,
            licensee: T::AccountId,
            amount: BalanceOf<T>,
        },
        PaymentsCompleted {
            contract_id: T::ContractId,
            nft_id: T::NFTId,
        },

        // Add this new event
        ContractCreated {
            contract_id: T::ContractId,
            contract_type: ContractType,
            nft_id: T::NFTId,
            offered_by: T::AccountId,
            accepted_by: T::AccountId,
        },
    }

    #[pallet::error]
    pub enum Error<T> {
        // NFT validation errors
        NameTooLong,
        DescriptionTooLong,
        FilingDateTooLong,
        JurisdictionTooLong,

        // NFT state errors
        NftNotFound,
        NotNftOwner,
        NftInEscrow,

        // Contract/offer errors
        OfferNotFound,
        ContractNotFound,
        NotALicenseOffer,
        NotAPurchaseOffer,
        NotALicenseContract,
        NotAPurchaseContract,

        // License-specific errors
        LicenseNotActive,
        LicenseNotExpired,
        ActiveLicensesExist,
        ExclusiveLicenseExists,

        // Payment errors
        ZeroPayment,
        PaymentFailed,
        PaymentNotDue,
        PaymentNotCompleted,
        NotPeriodicPayment,
        InsufficientBalance,
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

            Nftss::<T>::insert(id, nft);

            Self::deposit_event(Event::NftMinted {
                owner: who,
                nft_id: id,
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(1)]
        pub fn offer_license(
            origin: OriginFor<T>,
            nft_id: T::NFTId,
            payment_type: PaymentType<T>,
            is_exclusive: bool,
            duration: BlockNumberFor<T>,
        ) -> DispatchResult {
            let licensor = ensure_signed(origin)?;
            Self::validate_nft_for_offer(nft_id, &licensor)?;

            let existing_contracts = NFTContracts::<T>::get(nft_id);
            if is_exclusive {
                ensure!(
                    existing_contracts.is_empty(),
                    Error::<T>::ActiveLicensesExist
                )
            } else {
                for contract_id in existing_contracts {
                    if let Some(Contract::License(license)) = Contracts::<T>::get(contract_id) {
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

            let offer_id = Self::get_next_offer_id();
            // Store offer
            Offers::<T>::insert(offer_id, offer);

            // Emit event
            Self::deposit_event(Event::LicenseOffered {
                offer_id,
                nft_id,
                is_exclusive,
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(2)]
        pub fn offer_purchase(
            origin: OriginFor<T>,
            nft_id: T::NFTId,
            payment_type: PaymentType<T>,
        ) -> DispatchResult {
            let seller = ensure_signed(origin)?;
            Self::validate_nft_for_offer(nft_id, &seller)?;

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

            let offer_id = Self::get_next_offer_id();

            // Store offer
            Offers::<T>::insert(offer_id, offer);

            // Emit event
            Self::deposit_event(Event::PurchaseOffered { offer_id, nft_id });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(3)]
        pub fn accept_license(origin: OriginFor<T>, offer_id: T::OfferId) -> DispatchResult {
            let licensee = ensure_signed(origin)?;

            // Get and validate offer
            let offer = Offers::<T>::get(offer_id).ok_or(Error::<T>::OfferNotFound)?;

            let license_offer = match offer {
                Offer::License(o) => o,
                _ => return Err(Error::<T>::NotALicenseOffer.into()),
            };
            let mut active_license = license_offer.init(licensee.clone());

            // Handle payment
            match &active_license.payment_type {
                PaymentType::OneTime(amount) => {
                    Self::process_payment(&licensee, &active_license.licensor, amount.clone())?;
                }
                PaymentType::Periodic {
                    amount_per_payment, ..
                } => {
                    Self::process_payment(
                        &licensee,
                        &active_license.licensor,
                        amount_per_payment.clone(),
                    )?;
                    active_license
                        .payment_schedule
                        .as_mut()
                        .unwrap()
                        .increment();
                }
            }

            // Create active license

            let contract_id = T::ContractId::from(offer_id);

            Contracts::<T>::insert(contract_id, Contract::License(active_license.clone()));
            NFTContracts::<T>::append(&active_license.nft_id, contract_id);

            // If exclusive, remove offer
            if active_license.is_exclusive {
                Offers::<T>::remove(offer_id);
            }

            // Emit event
            Self::deposit_event(Event::ContractCreated {
                contract_id,
                contract_type: ContractType::License,
                nft_id: active_license.nft_id,
                offered_by: active_license.licensor.clone(),
                accepted_by: licensee.clone(),
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(4)]
        pub fn accept_purchase(origin: OriginFor<T>, offer_id: T::OfferId) -> DispatchResult {
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
                    Nftss::<T>::mutate(purchase_offer.nft_id, |maybe_nft| {
                        if let Some(nft) = maybe_nft {
                            nft.owner = buyer.clone();
                        }
                    });

                    // Remove offer
                    Offers::<T>::remove(offer_id);

                    // Emit event
                    Self::deposit_event(Event::PaymentsCompleted {
                        contract_id: T::ContractId::from(offer_id),
                        nft_id: purchase_offer.nft_id,
                    });
                    // emit event
                    Self::deposit_event(Event::ContractCompleted {
                        contract_id: T::ContractId::from(offer_id),
                        contract_type: ContractType::Purchase,
                        nft_id: purchase_offer.nft_id,
                        offered_by: purchase_offer.seller,
                        accepted_by: buyer,
                        total_paid: amount,
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
                    Self::escrow_nft(purchase_offer.nft_id, &purchase_offer.seller);

                    // Create active purchase contract
                    let mut active_purchase = purchase_offer.init(buyer.clone());
                    active_purchase
                        .payment_schedule
                        .as_mut()
                        .unwrap()
                        .increment();
                    Contracts::<T>::insert(
                        T::ContractId::from(offer_id),
                        Contract::Purchase(active_purchase.clone()),
                    );
                    NFTContracts::<T>::append(
                        &active_purchase.nft_id,
                        T::ContractId::from(offer_id),
                    );

                    // Remove offer
                    Offers::<T>::remove(offer_id);

                    // Emit event
                    Self::deposit_event(Event::ContractCreated {
                        contract_id: T::ContractId::from(offer_id),
                        contract_type: ContractType::Purchase,
                        nft_id: active_purchase.nft_id,
                        offered_by: active_purchase.seller.clone(),
                        accepted_by: buyer.clone(),
                    });
                }
            }

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(5)]
        pub fn make_periodic_payment(
            origin: OriginFor<T>,
            contract_id: T::ContractId,
        ) -> DispatchResult {
            let payer = ensure_signed(origin)?;

            // Get and validate contract exists
            let mut contract =
                Contracts::<T>::get(contract_id).ok_or(Error::<T>::ContractNotFound)?;

            // Get common fields based on contract type
            let (payment_type, payment_schedule, nft_id, payee) = match &mut contract {
                Contract::License(license) => (
                    &license.payment_type,
                    &mut license.payment_schedule,
                    license.nft_id,
                    license.licensor.clone(),
                ),
                Contract::Purchase(purchase) => (
                    &purchase.payment_type,
                    &mut purchase.payment_schedule,
                    purchase.nft_id,
                    purchase.seller.clone(),
                ),
            };

            // Get payment schedule
            let schedule = payment_schedule
                .as_mut()
                .ok_or(Error::<T>::NotPeriodicPayment)?;

            // Ensure payment is due
            let current_block = frame_system::Pallet::<T>::block_number();
            ensure!(
                current_block >= schedule.next_payment_block && schedule.payments_due > 0u32.into(),
                Error::<T>::PaymentNotDue
            );

            let amount_per_payment = match payment_type {
                PaymentType::Periodic {
                    amount_per_payment, ..
                } => amount_per_payment,
                _ => return Err(Error::<T>::NotPeriodicPayment.into()),
            };

            // Calculate amount including any penalties
            let amount = Self::calculate_amount_due(*amount_per_payment, schedule);

            // Process payment
            Self::process_payment(&payer, &payee, amount)?;

            // Update payment schedule
            schedule.payments_made += 1u32.into();
            schedule.payments_due = schedule.payments_due.saturating_sub(1u32.into());
            schedule.missed_payments = None; // Reset missed payments
            schedule.penalty_amount = None; // Reset penalty
            if !schedule.payments_due.is_zero() {
                schedule.next_payment_block += match payment_type {
                    PaymentType::Periodic { frequency, .. } => *frequency,
                    _ => Zero::zero(),
                };
            }

            // Emit periodic payment event first
            Self::deposit_event(Event::PeriodicPaymentMade {
                contract_id,
                nft_id,
                payer: payer.clone(),
                payee: payee.clone(),
                amount,
            });

            // Handle completion if all payments are made
            if schedule.payments_due.is_zero() {
                let total_paid = match payment_type {
                    PaymentType::Periodic {
                        amount_per_payment, ..
                    } => *amount_per_payment * schedule.payments_made.into(),
                    PaymentType::OneTime(amount) => *amount,
                };

                // Emit completion events
                Self::deposit_event(Event::PaymentsCompleted {
                    contract_id,
                    nft_id,
                });

                Self::deposit_event(Event::ContractCompleted {
                    contract_id,
                    contract_type: match contract {
                        Contract::License(_) => ContractType::License,
                        Contract::Purchase(_) => ContractType::Purchase,
                    },
                    nft_id,
                    offered_by: payee,
                    accepted_by: payer,
                    total_paid,
                });
            }

            // Update contract
            Contracts::<T>::insert(contract_id, contract);

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(6)]
        pub fn expire_license(origin: OriginFor<T>, contract_id: T::ContractId) -> DispatchResult {
            let _ = ensure_signed(origin)?;

            // Get and validate contract
            let contract = Contracts::<T>::get(contract_id).ok_or(Error::<T>::ContractNotFound)?;
            let license = match contract {
                Contract::License(l) => l,
                Contract::Purchase(_) => return Err(Error::<T>::NotALicenseContract.into()),
            };

            let current_block = frame_system::Pallet::<T>::block_number();
            ensure!(
                current_block >= license.start_block + license.duration,
                Error::<T>::LicenseNotExpired
            );

            let payments_made = license
                .payment_schedule
                .map_or(One::one(), |schedule| schedule.payments_made);

            // Calculate total paid
            let total_paid = Self::calculate_total_paid(&license.payment_type, payments_made);

            // Cleanup contract
            Self::cleanup_contract(contract_id, license.nft_id);

            // Emit expiry event
            Self::deposit_event(Event::ContractExpired {
                contract_id,
                contract_type: ContractType::License,
                nft_id: license.nft_id,
                offered_by: license.licensor,
                accepted_by: license.licensee,
                payments_made,
                total_paid,
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(7)]
        pub fn complete_purchase(
            origin: OriginFor<T>,
            contract_id: T::ContractId,
        ) -> DispatchResult {
            let _ = ensure_signed(origin)?;

            // Get and validate contract
            let contract = Contracts::<T>::get(contract_id).ok_or(Error::<T>::ContractNotFound)?;

            let purchase = match contract {
                Contract::Purchase(p) => p,
                Contract::License(_) => return Err(Error::<T>::NotAPurchaseOffer.into()),
            };

            // Ensure all payments have been made
            let schedule = purchase
                .payment_schedule
                .as_ref()
                .ok_or(Error::<T>::NotPeriodicPayment)?;
            ensure!(
                schedule.payments_due.is_zero(),
                Error::<T>::PaymentNotCompleted
            );

            // Remove from escrow
            EscrowedNfts::<T>::remove(&purchase.nft_id);
            // Emit un-escrow event
            Self::deposit_event(Event::NftRemovedFromEscrow {
                nft_id: purchase.nft_id,
                owner: purchase.seller.clone(),
            });

            // Transfer NFT ownership
            Nftss::<T>::mutate(purchase.nft_id, |maybe_nft| {
                if let Some(nft) = maybe_nft {
                    nft.owner = purchase.buyer.clone();
                }
            });

            let payments_made = purchase
                .payment_schedule
                .map_or(One::one(), |schedule| schedule.payments_made);

            // Calculate total paid
            let total_paid = Self::calculate_total_paid(&purchase.payment_type, payments_made);

            // Cleanup contract
            Self::cleanup_contract(contract_id, purchase.nft_id);

            // Emit contract completion event
            Self::deposit_event(Event::ContractCompleted {
                contract_id,
                contract_type: ContractType::Purchase,
                nft_id: purchase.nft_id,
                offered_by: purchase.seller,
                accepted_by: purchase.buyer,
                total_paid,
            });

            Ok(())
        }
    }

    impl<T: Config> Pallet<T> {
        fn validate_nft_for_offer(
            nft_id: T::NFTId,
            owner: &T::AccountId,
        ) -> Result<(), DispatchError> {
            // Ensure caller owns the NFT
            let nft = Nftss::<T>::get(nft_id).ok_or(Error::<T>::NftNotFound)?;
            ensure!(nft.owner == *owner, Error::<T>::NotNftOwner);
            // Ensure NFT not in escrow
            ensure!(
                !EscrowedNfts::<T>::contains_key(nft_id),
                Error::<T>::NftInEscrow
            );
            Ok(())
        }

        // Shared offer ID generation
        fn get_next_offer_id() -> T::OfferId {
            NextOfferId::<T>::mutate(|id| {
                let current = *id;
                *id = id.saturating_add(T::OfferId::one());
                current
            })
        }

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
            )
            .map_err(|_| Error::<T>::InsufficientBalance)?;

            // Emit payment event
            Self::deposit_event(Event::PaymentMade {
                payer: payer.clone(),
                payee: payee.clone(),
                amount: amount,
            });

            Ok(())
        }

        // Handles NFT escrow process and emits event
        fn escrow_nft(nft_id: T::NFTId, owner: &T::AccountId) {
            EscrowedNfts::<T>::insert(&nft_id, owner);
            Self::deposit_event(Event::NftEscrowed {
                nft_id,
                owner: owner.clone(),
            });
        }

        // Cleanup contract and NFT contract mappings
        fn cleanup_contract(contract_id: T::ContractId, nft_id: T::NFTId) {
            // Remove from NFT contracts list
            NFTContracts::<T>::mutate(nft_id, |contracts| {
                contracts.retain(|&id| id != contract_id);
            });
            // Remove from active contracts
            Contracts::<T>::remove(contract_id);
        }

        // Calculate total paid for a contract
        fn calculate_total_paid(
            payment_type: &PaymentType<T>,
            payments_made: T::Index,
        ) -> BalanceOf<T> {
            match payment_type {
                PaymentType::Periodic {
                    amount_per_payment, ..
                } => *amount_per_payment * payments_made.into(),
                PaymentType::OneTime(amount) => *amount,
            }
        }

        // Get periodic payment details from contract
        fn get_periodic_payment_details(
            contract: &Contract<T>,
        ) -> Option<(
            &PaymentSchedule<T>,
            &PaymentType<T>,
            T::NFTId,
            &T::AccountId,
            &T::AccountId,
        )> {
            match contract {
                Contract::License(license) => license.payment_schedule.as_ref().map(|schedule| {
                    (
                        schedule,
                        &license.payment_type,
                        license.nft_id,
                        &license.licensee,
                        &license.licensor,
                    )
                }),
                Contract::Purchase(purchase) => {
                    purchase.payment_schedule.as_ref().map(|schedule| {
                        (
                            schedule,
                            &purchase.payment_type,
                            purchase.nft_id,
                            &purchase.buyer,
                            &purchase.seller,
                        )
                    })
                }
            }
        }

        // Helper to calculate total amount due including penalties
        fn calculate_amount_due(
            base_amount: BalanceOf<T>,
            schedule: &PaymentSchedule<T>,
        ) -> BalanceOf<T> {
            let missed_amount = schedule
                .missed_payments
                .map(|m| base_amount * m.into())
                .unwrap_or_else(Zero::zero);

            base_amount
                .saturating_add(missed_amount)
                .saturating_add(schedule.penalty_amount.unwrap_or_else(Zero::zero))
        }

        fn update_schedule_with_penalty(
            schedule: &PaymentSchedule<T>,
            amount_per_payment: &BalanceOf<T>,
        ) -> PaymentSchedule<T> {
            let mut new_schedule = schedule.clone();
            new_schedule.missed_payments = Some(1u32.into());
            new_schedule.penalty_amount = Some(*amount_per_payment * 20u32.into() / 100u32.into());
            new_schedule
        }
    }
    #[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
        fn on_initialize(n: BlockNumberFor<T>) -> Weight {
            let mut weight = T::DbWeight::get().reads(1);

            for (contract_id, contract) in Contracts::<T>::iter() {
                if let Some((schedule, payment_type, nft_id, payer, payee)) =
                    Self::get_periodic_payment_details(&contract)
                {
                    if n > schedule.next_payment_block {
                        if schedule.missed_payments.is_some() {
                            // Second miss - cancel contract
                            Self::cleanup_contract(contract_id, nft_id);
                            Self::deposit_event(Event::ContractExpired {
                                contract_id,
                                contract_type: match contract {
                                    Contract::License(_) => ContractType::License,
                                    Contract::Purchase(_) => ContractType::Purchase,
                                },
                                nft_id,
                                offered_by: payee.clone(),
                                accepted_by: payer.clone(),
                                payments_made: schedule.payments_made,
                                total_paid: Self::calculate_total_paid(
                                    payment_type,
                                    schedule.payments_made,
                                ),
                            });
                        } else {
                            // First miss - mark missed payment and add penalty
                            let PaymentType::Periodic {
                                amount_per_payment, ..
                            } = payment_type
                            else {
                                continue;
                            };

                            let new_contract = match &contract {
                                Contract::License(license) => {
                                    let new_schedule = Self::update_schedule_with_penalty(
                                        license.payment_schedule.as_ref().unwrap(),
                                        amount_per_payment,
                                    );
                                    Contract::License(License {
                                        payment_schedule: Some(new_schedule),
                                        ..license.clone()
                                    })
                                }
                                Contract::Purchase(purchase) => {
                                    let new_schedule = Self::update_schedule_with_penalty(
                                        purchase.payment_schedule.as_ref().unwrap(),
                                        amount_per_payment,
                                    );
                                    Contract::Purchase(PurchaseContract {
                                        payment_schedule: Some(new_schedule),
                                        ..purchase.clone()
                                    })
                                }
                            };

                            Contracts::<T>::insert(contract_id, new_contract);
                            Self::deposit_event(Event::PeriodicPaymentFailed {
                                contract_id,
                                nft_id,
                                licensee: payer.clone(),
                                amount: Self::calculate_amount_due(*amount_per_payment, schedule),
                            });
                        }
                        weight = weight.saturating_add(T::DbWeight::get().reads_writes(1, 1));
                    }
                }
            }
            weight
        }
    }
}

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;
