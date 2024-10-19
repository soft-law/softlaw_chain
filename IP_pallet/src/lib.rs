#![cfg_attr(not(feature = "std"), no_std)]

pub use self::pallet::*;

#[frame_support::pallet(dev_mode)]
pub mod pallet {
    use frame_support::{pallet_prelude::*, traits::Currency};
    use frame_system::pallet_prelude::*;
    use sp_std::prelude::*;
    use frame_support::sp_runtime::traits::Hash;

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type Currency: Currency<Self::AccountId>;
        #[pallet::constant]
        type MaxNameLength: Get<u32>;
        #[pallet::constant]
        type MaxDescriptionLength: Get<u32>;
    }

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::storage]
    #[pallet::getter(fn nfts)]
    pub type Nfts<T: Config> = StorageMap<_, Blake2_128Concat, T::Hash, NFT<T>>;

    #[pallet::storage]
    #[pallet::getter(fn next_nft_id)]
    pub type NextNftId<T: Config> = StorageValue<_, u32, ValueQuery>;

    #[pallet::storage]
    #[pallet::getter(fn escrow)]
    pub type Escrow<T:Config> = StorageMap<_, Blake2_128Concat, T::Hash, (T::AccountId, BalanceOf<T>)>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        NftMinted { owner: T::AccountId, nft_id: T::Hash, name: Vec<u8>, number: u32 },
        NftEscrowed { nft_id: T::Hash, owner: T::AccountId, price: BalanceOf<T> },
    }

    #[pallet::error]
    pub enum Error<T> {
        NftAlreadyExists,
        NameTooLong,
        DescriptionTooLong,
        FilingDateTooLong,
        JurisdictionTooLong,
        NftNotFound,
        NotNftOwner,
        NftAlreadyEscrowed,
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

    type BalanceOf<T> =
        <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

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

            let bounded_description: BoundedVec<u8, T::MaxDescriptionLength> =
                description.try_into().map_err(|_| Error::<T>::DescriptionTooLong)?;

            let bounded_filing_date: BoundedVec<u8, T::MaxNameLength> =
                filing_date.try_into().map_err(|_| Error::<T>::FilingDateTooLong)?;

            let bounded_jurisdiction: BoundedVec<u8, T::MaxNameLength> =
                jurisdiction.try_into().map_err(|_| Error::<T>::JurisdictionTooLong)?;

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

            Self::deposit_event(Event::NftMinted { owner: who, nft_id, name: bounded_name.into(), number });

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
            ensure!(!Escrow::<T>::contains_key(nft_id), Error::<T>::NftAlreadyEscrowed);

            Escrow::<T>::insert(nft_id, (who.clone(), price));

            Self::deposit_event(Event::NftEscrowed { nft_id, owner: who, price });

            Ok(())
        }
    }
}

pub use pallet::*;

#[cfg(test)]
mod mock;

#[cfg(test)]
mod tests;