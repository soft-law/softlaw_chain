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
#[scale_info(skip_type_params(T))]
pub enum PaymentType<T: Config> {
    OneTime(BalanceOf<T>),
    Periodic {
        amount_per_payment: BalanceOf<T>,
        total_payments: T::Index,
        frequency: BlockNumberFor<T>,
    },
}

// Implement Debug manually
impl<T: Config> core::fmt::Debug for PaymentType<T> 
where
    BalanceOf<T>: core::fmt::Debug,
    T::Index: core::fmt::Debug,
    BlockNumberFor<T>: core::fmt::Debug,
{
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        match self {
            PaymentType::OneTime(amount) => f.debug_tuple("OneTime").field(amount).finish(),
            PaymentType::Periodic { 
                amount_per_payment, 
                total_payments, 
                frequency 
            } => f.debug_struct("Periodic")
                .field("amount_per_payment", amount_per_payment)
                .field("total_payments", total_payments)
                .field("frequency", frequency)
                .finish(),
        }
    }
}

#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen, RuntimeDebug)]
#[scale_info(skip_type_params(T))]
pub struct PaymentSchedule<T: Config> {
    pub start_block: BlockNumberFor<T>,
    pub next_payment_block: BlockNumberFor<T>,
    pub payments_made: T::Index,
    pub payments_due: T::Index,
}

#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
#[scale_info(skip_type_params(T))]
pub struct NFT<T: Config> {
    pub id: T::NFTId,
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
    pub nft_id: T::NFTId,
    pub licensor: T::AccountId,
    pub licensee: Option<T::AccountId>,
    pub is_purchase: bool,
    pub duration: Option<BlockNumberFor<T>>,
    pub start_block: Option<BlockNumberFor<T>>,
    pub payment_type: PaymentType<T>,
    pub payment_schedule: Option<PaymentSchedule<T>>,
    pub is_exclusive: bool,
    pub status: LicenseStatus,
}
