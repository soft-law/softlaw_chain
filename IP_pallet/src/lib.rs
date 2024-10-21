#![cfg_attr(not(feature = "std"), no_std)]

pub use self::pallet::*;

#[frame_support::pallet(dev_mode)]
pub mod pallet {
    use frame_support::sp_runtime::traits::{AtLeast32BitUnsigned, Hash, One, Saturating, Zero};
    use frame_support::traits::ExistenceRequirement;
    use frame_support::{pallet_prelude::*, traits::Currency, traits::Hooks};
    use frame_system::pallet_prelude::*;
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
        #[pallet::constant]
        type MaxNameLength: Get<u32>;
        #[pallet::constant]
        type MaxDescriptionLength: Get<u32>;
        #[pallet::constant]
        type MaxRightsCount: Get<u32>;
    }

    #[pallet::pallet]
    pub struct Pallet<T>(_);
    type BalanceOf<T> =
        <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

    #[pallet::storage]
    #[pallet::getter(fn nfts)]
    pub type Nfts<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, NFT<T>>;

    #[pallet::storage]
    #[pallet::getter(fn next_nft_id)]
    pub type NextNftId<T: Config> = StorageValue<_, u32, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn next_license_id)]
    pub type NextLicenseId<T: Config> = StorageValue<_, T::LicenseId, ValueQuery>;

    #[pallet::storage]
    pub type Licenses<T: Config> = StorageMap<_, Blake2_128Concat, T::LicenseId, License<T>>;

    #[pallet::storage]
    pub type LicenseOwnership<T: Config> = StorageDoubleMap<
        _,
        Blake2_128Concat,
        T::Hash, // NFT ID
        Blake2_128Concat,
        T::AccountId, // Licensee
        T::LicenseId, // License ID
    >;

    #[pallet::storage]
    #[pallet::getter(fn escrow)]
    pub type Escrow<T: Config> =
        StorageMap<_, Blake2_128Concat, T::Hash, (T::AccountId, BalanceOf<T>)>;

    #[pallet::storage]
    pub type EscrowedNfts<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, T::AccountId>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        NftMinted {
            owner: T::AccountId,
            nft_id: T::Hash,
            name: Vec<u8>,
            number: u32,
        },
        NftEscrowed {
            nft_id: T::Hash,
            owner: T::AccountId,
            price: BalanceOf<T>,
        },

        LicenseExpired {
            license_id: T::LicenseId,
            nft_id: T::Hash,
            licensee: T::AccountId,
        },

        PeriodicPaymentFailed {
            license_id: T::LicenseId,
            nft_id: T::Hash,
            licensee: T::AccountId,
            amount: BalanceOf<T>,
        },
        LicenseOffered {
            nft_id: T::Hash,
            license_id: T::LicenseId,
            licensor: T::AccountId,
        },
        LicenseAccepted {
            nft_id: T::Hash,
            license_id: T::LicenseId,
            licensee: T::AccountId,
        },
        LicenseRevoked {
            license_id: T::LicenseId,
            nft_id: T::Hash,
            licensee: T::AccountId,
            reason: RevokeReason,
        },
        PeriodicPaymentProcessed {
            license_id: T::LicenseId,
            nft_id: T::Hash,
            licensee: T::AccountId,
            licensor: T::AccountId,
            amount: BalanceOf<T>,
        },
        LicenseCompleted {
            license_id: T::LicenseId,
            nft_id: T::Hash,
            licensee: T::AccountId,
        },
    }

    #[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen, Debug)]
    pub enum RevokeReason {
        Expired,
        Violation,
        MutualAgreement,
        PaymentFailure,
        Other,
    }
    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
    pub enum LicenseStatus {
        Offered,
        Active,
        Completed,
        Expired,
    }

    #[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen)]
    #[cfg_attr(feature = "std", derive(Debug))]
    pub enum PaymentType<Balance, BlockNumber> {
        OneTime(Balance),
        Periodic {
            amount: Balance,
            period: BlockNumber,
            last_payment: BlockNumber,
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
    }

    #[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
    #[scale_info(skip_type_params(T))]
    pub struct NFT<T: Config> {
        pub owner: T::AccountId,
        pub name: BoundedVec<u8, T::MaxNameLength>,
        pub description: BoundedVec<u8, T::MaxDescriptionLength>,
        pub filing_date: BoundedVec<u8, T::MaxNameLength>,
        pub jurisdiction: BoundedVec<u8, T::MaxNameLength>,
        pub number: u32,
    }

    // Update the License struct
    #[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen)]
    #[scale_info(skip_type_params(T))]
    pub struct License<T: Config> {
        pub nft_id: T::Hash,
        pub licensor: T::AccountId,
        pub licensee: Option<T::AccountId>,
        pub price: BalanceOf<T>,
        pub is_purchase: bool,
        pub duration: Option<BlockNumberFor<T>>,
        pub payment_type: PaymentType<BalanceOf<T>, BlockNumberFor<T>>,
        pub is_exclusive: bool,
        pub status: LicenseStatus,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(10_000)]
        #[pallet::call_index(0)]
        pub fn mint_nft(
            origin: OriginFor<T>,
            name: Vec<u8>,
            description: Vec<u8>,
            filing_date: Vec<u8>,
            jurisdiction: Vec<u8>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            let bounded_name: BoundedVec<u8, T::MaxNameLength> =
                name.try_into().map_err(|_| Error::<T>::NameTooLong)?;

            let bounded_description: BoundedVec<u8, T::MaxDescriptionLength> = description
                .try_into()
                .map_err(|_| Error::<T>::DescriptionTooLong)?;

            let bounded_filing_date: BoundedVec<u8, T::MaxNameLength> = filing_date
                .try_into()
                .map_err(|_| Error::<T>::FilingDateTooLong)?;

            let bounded_jurisdiction: BoundedVec<u8, T::MaxNameLength> = jurisdiction
                .try_into()
                .map_err(|_| Error::<T>::JurisdictionTooLong)?;

            let number = Self::next_nft_id();
            NextNftId::<T>::put(number.saturating_add(1));

            let nft = NFT {
                owner: who.clone(),
                name: bounded_name.clone(),
                description: bounded_description,
                filing_date: bounded_filing_date,
                jurisdiction: bounded_jurisdiction,
                number,
            };

            let nft_id = T::Hashing::hash_of(&nft);

            Nfts::<T>::insert(nft_id, nft);

            Self::deposit_event(Event::NftMinted {
                owner: who,
                nft_id,
                name: bounded_name.into(),
                number,
            });

            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(1)]
        pub fn escrow_nft(
            origin: OriginFor<T>,
            nft_id: T::Hash,
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
        pub fn create_license(
            origin: OriginFor<T>,
            nft_id: T::Hash,
            price: BalanceOf<T>,
            is_purchase: bool,
            duration: Option<BlockNumberFor<T>>,
            payment_type: PaymentType<BalanceOf<T>, BlockNumberFor<T>>,
            is_exclusive: bool,
        ) -> DispatchResult {
            let licensor = ensure_signed(origin)?;
            ensure!(Nfts::<T>::contains_key(nft_id), Error::<T>::NftNotFound);
            ensure!(
                Nfts::<T>::get(nft_id).unwrap().owner == licensor,
                Error::<T>::NotNftOwner
            );

            let license = License {
                nft_id,
                licensor: licensor.clone(),
                licensee: None,
                price,
                is_purchase,
                duration,
                payment_type,
                is_exclusive,
                status: LicenseStatus::Offered,
            };

            let license_id = Self::next_license_id();
            Licenses::<T>::insert(license_id, license);
            NextLicenseId::<T>::mutate(|id| *id = id.saturating_add(T::LicenseId::one()));

            Self::deposit_event(Event::LicenseOffered {
                nft_id,
                license_id,
                licensor,
            });
            Ok(())
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(3)]
        pub fn accept_license(origin: OriginFor<T>, license_id: T::LicenseId) -> DispatchResult {
            let licensee = ensure_signed(origin)?;
            Licenses::<T>::try_mutate(license_id, |maybe_license| -> DispatchResult {
                let license = maybe_license.as_mut().ok_or(Error::<T>::LicenseNotFound)?;
                ensure!(
                    license.status == LicenseStatus::Offered,
                    Error::<T>::LicenseNotOffered
                );
                ensure!(
                    !LicenseOwnership::<T>::contains_key(license.nft_id, &licensee),
                    Error::<T>::AlreadyLicensed
                );

                let nft = Nfts::<T>::get(license.nft_id).ok_or(Error::<T>::NftNotFound)?;
                ensure!(nft.owner == license.licensor, Error::<T>::NotNftOwner);

                // Escrow the NFT
                EscrowedNfts::<T>::insert(license.nft_id, nft.owner.clone());

                // Handle initial payment
                match &license.payment_type {
                    PaymentType::OneTime(amount) => {
                        T::Currency::transfer(
                            &licensee,
                            &license.licensor,
                            *amount,
                            ExistenceRequirement::KeepAlive,
                        )?;
                        if license.is_purchase {
                            license.status = LicenseStatus::Completed;
                            // Transfer NFT ownership to buyer
                            Nfts::<T>::mutate(license.nft_id, |maybe_nft| {
                                if let Some(nft) = maybe_nft {
                                    nft.owner = licensee.clone();
                                }
                            });
                            EscrowedNfts::<T>::remove(license.nft_id);
                        } else {
                            license.status = LicenseStatus::Active;
                        }
                    }
                    PaymentType::Periodic { amount, .. } => {
                        T::Currency::transfer(
                            &licensee,
                            &license.licensor,
                            *amount,
                            ExistenceRequirement::KeepAlive,
                        )?;
                        license.status = LicenseStatus::Active;
                    }
                }

                license.licensee = Some(licensee.clone());
                LicenseOwnership::<T>::insert(license.nft_id, &licensee, license_id);

                Self::deposit_event(Event::LicenseAccepted {
                    license_id,
                    nft_id: license.nft_id,
                    licensee,
                });
                Ok(())
            })
        }

        #[pallet::weight(10_000)]
        #[pallet::call_index(4)]
        pub fn revoke_license(
            origin: OriginFor<T>,
            license_id: T::LicenseId,
            reason: RevokeReason,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            Licenses::<T>::try_mutate(license_id, |maybe_license| -> DispatchResult {
                let license = maybe_license.as_mut().ok_or(Error::<T>::LicenseNotFound)?;

                ensure!(license.licensor == who, Error::<T>::NotLicenseOwner);
                
                // Check if the license is revocable
                ensure!(
                    license.status == LicenseStatus::Offered || 
                    (license.status == LicenseStatus::Active && Self::no_payments_made(license)),
                    Error::<T>::LicenseNotRevocable
                );

                let licensee = license.licensee.as_ref().ok_or(Error::<T>::LicenseOwnershipNotFound)?;

                LicenseOwnership::<T>::remove(license.nft_id, licensee);
                
                Self::deposit_event(Event::LicenseRevoked {
                    license_id,
                    nft_id: license.nft_id,
                    licensee: licensee.clone(),
                    reason: reason.clone(),
                });

                // Remove the license
                *maybe_license = None;

                Ok(())
            })
        }
    }

    #[pallet::hooks]
    impl<T: Config> Hooks<BlockNumberFor<T>> for Pallet<T> {
        fn on_initialize(n: BlockNumberFor<T>) -> Weight {
            let mut weight = T::DbWeight::get().reads(1);

            for (license_id, license) in Licenses::<T>::iter() {
                if license.status == LicenseStatus::Active {
                    weight =
                        weight.saturating_add(Self::process_active_license(license_id, license, n));
                }
            }

            weight
        }
    }

    impl<T: Config> Pallet<T> {
        fn process_active_license(
            license_id: T::LicenseId,
            mut license: License<T>,
            n: BlockNumberFor<T>,
        ) -> Weight {
            let mut weight = T::DbWeight::get().reads(1);

            let should_expire = Self::check_license_expiration(&license, n);
            let payments_completed = Self::check_payments_completed(&license, n);

            if let PaymentType::Periodic {
                period,
                last_payment,
                ..
            } = license.payment_type
            {
                if n >= last_payment + period {
                    // Time for a periodic payment
                    match Self::process_periodic_payment(license_id, n) {
                        Ok(_) => {
                            // Payment successful, no need to update license here
                            weight = weight.saturating_add(T::DbWeight::get().reads_writes(1, 1));
                        }
                        Err(_) => {
                            // Payment failed, license will be cancelled in process_periodic_payment
                            weight = weight.saturating_add(T::DbWeight::get().reads_writes(3, 3));
                            return weight; // Exit early as the license has been cancelled
                        }
                    }
                }
            }

            if should_expire {
                if let Some(licensee) = license.licensee.clone() {
                    weight =
                        weight.saturating_add(Self::expire_license(license_id, &license, licensee));
                }
            } else if payments_completed && license.is_purchase {
                if let Some(licensee) = license.licensee.clone() {
                    weight = weight.saturating_add(Self::complete_purchase_license(
                        license_id,
                        &mut license,
                        licensee,
                    ));
                }
            }

            weight
        }

        fn check_license_expiration(license: &License<T>, n: BlockNumberFor<T>) -> bool {
            if let PaymentType::Periodic {
                period,
                last_payment,
                ..
            } = license.payment_type
            {
                if n >= last_payment + period {
                    return true;
                }
            }

            if let Some(duration) = license.duration {
                return n >= duration;
            }

            false
        }

        fn check_payments_completed(license: &License<T>, _n: BlockNumberFor<T>) -> bool {
            matches!(license.payment_type, PaymentType::OneTime(_))
        }

        fn complete_purchase_license(
            license_id: T::LicenseId,
            license: &mut License<T>,
            licensee: T::AccountId,
        ) -> Weight {
            let weight = T::DbWeight::get().reads_writes(3, 3);

            // Transfer NFT to buyer
            Nfts::<T>::mutate(license.nft_id, |maybe_nft| {
                if let Some(nft) = maybe_nft {
                    nft.owner = licensee.clone();
                }
            });
            EscrowedNfts::<T>::remove(license.nft_id);

            license.status = LicenseStatus::Completed;
            Licenses::<T>::insert(license_id, license.clone());
            LicenseOwnership::<T>::remove(license.nft_id, &licensee);

            Self::deposit_event(Event::LicenseCompleted {
                license_id,
                nft_id: license.nft_id,
                licensee,
            });

            weight
        }

        fn expire_license(
            license_id: T::LicenseId,
            license: &License<T>,
            licensee: T::AccountId,
        ) -> Weight {
            let weight = T::DbWeight::get().reads_writes(3, 3);

            // Transfer NFT back to licensor if it was escrowed
            if EscrowedNfts::<T>::contains_key(license.nft_id) {
                EscrowedNfts::<T>::remove(license.nft_id);
                Nfts::<T>::mutate(license.nft_id, |maybe_nft| {
                    if let Some(nft) = maybe_nft {
                        nft.owner = license.licensor.clone();
                    }
                });
            }

            // Remove the license and ownership
            Licenses::<T>::remove(license_id);
            LicenseOwnership::<T>::remove(license.nft_id, &licensee);

            Self::deposit_event(Event::LicenseExpired {
                license_id,
                nft_id: license.nft_id,
                licensee,
            });

            weight
        }

        fn process_periodic_payment(
            license_id: T::LicenseId,
            current_block: BlockNumberFor<T>,
        ) -> Result<(), DispatchError> {
            Licenses::<T>::try_mutate(license_id, |maybe_license| -> Result<(), DispatchError> {
                let license = maybe_license.as_mut().ok_or(Error::<T>::LicenseNotFound)?;

                if let PaymentType::Periodic {
                    amount,
                    period,
                    last_payment,
                } = &mut license.payment_type
                {
                    if current_block >= *last_payment + *period {
                        // Find the licensee
                        if let Some(licensee) = license.licensee.as_ref() {
                            // Attempt to transfer payment from licensee to licensor
                            match T::Currency::transfer(
                                licensee,
                                &license.licensor,
                                *amount,
                                ExistenceRequirement::KeepAlive,
                            ) {
                                Ok(_) => {
                                    // Payment successful, update last_payment
                                    *last_payment = current_block;

                                    Self::deposit_event(Event::PeriodicPaymentProcessed {
                                        license_id,
                                        nft_id: license.nft_id,
                                        licensee: licensee.clone(),
                                        licensor: license.licensor.clone(),
                                        amount: *amount,
                                    });
                                }
                                Err(err) => {
                                    // Payment failed
                                    Self::deposit_event(Event::PeriodicPaymentFailed {
                                        license_id,
                                        nft_id: license.nft_id,
                                        licensee: licensee.clone(),
                                        amount: *amount,
                                    });

                                    // Cancel the license
                                    Self::cancel_license(
                                        license_id,
                                        license.nft_id,
                                        licensee.clone(),
                                    )?;

                                    return Err(err);
                                }
                            }
                        } else {
                            return Err(Error::<T>::LicenseOwnershipNotFound.into());
                        }
                    }
                }
                Ok(())
            })
        }

        fn cancel_license(
            license_id: T::LicenseId,
            nft_id: T::Hash,
            licensee: T::AccountId,
        ) -> DispatchResult {
            // Remove the license
            Licenses::<T>::remove(license_id);

            // Remove the license ownership
            LicenseOwnership::<T>::remove(nft_id, &licensee);

            // If the NFT was escrowed, return it to the licensor
            if let Some(licensor) = EscrowedNfts::<T>::take(nft_id) {
                Nfts::<T>::mutate(nft_id, |maybe_nft| {
                    if let Some(nft) = maybe_nft {
                        nft.owner = licensor;
                    }
                });
            }

            Self::deposit_event(Event::LicenseRevoked {
                license_id,
                nft_id,
                licensee,
                reason: RevokeReason::PaymentFailure,
            });

            Ok(())
        }

        fn no_payments_made(license: &License<T>) -> bool {
            match license.payment_type {
                PaymentType::OneTime(_) => true,
                PaymentType::Periodic {
                    last_payment,
                    ..
                } => last_payment == Zero::zero(),
            }
        }
    }
}

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;

