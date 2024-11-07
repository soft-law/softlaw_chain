use frame_support::{pallet_prelude::*, traits::Currency};
use frame_system::pallet_prelude::*;

use crate::pallet::Config;
use sp_std::prelude::*;

pub type BalanceOf<T> =
    <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

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
        amount_per_payment: Balance,
        total_payments: u32,
        frequency: BlockNumber,
    },
}

#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen)]
#[cfg_attr(feature = "std", derive(Debug))]
pub struct PaymentSchedule<BlockNumber> {
    pub start_block: BlockNumber,
    pub next_payment_block: BlockNumber,
    pub payments_made: u32,
    pub payments_due: u32,
}

#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
#[scale_info(skip_type_params(T))]
pub struct NFT<T: Config> {
    pub id: u32, // Add this line
    pub owner: T::AccountId,
    pub name: BoundedVec<u8, T::MaxNameLength>,
    pub description: BoundedVec<u8, T::MaxDescriptionLength>,
    pub filing_date: BoundedVec<u8, T::MaxNameLength>,
    pub jurisdiction: BoundedVec<u8, T::MaxNameLength>,
}

// Update the License struct
#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen)]
#[scale_info(skip_type_params(T))]
pub struct License<T: Config> {
    pub nft_id: u32,
    pub licensor: T::AccountId,
    pub licensee: Option<T::AccountId>,
    pub price: BalanceOf<T>,
    pub is_purchase: bool,
    pub duration: Option<BlockNumberFor<T>>,
    pub start_block: Option<BlockNumberFor<T>>,
    pub payment_type: PaymentType<BalanceOf<T>, BlockNumberFor<T>>,
    pub payment_schedule: Option<PaymentSchedule<BlockNumberFor<T>>>,
    pub is_exclusive: bool,
    pub status: LicenseStatus,
}
