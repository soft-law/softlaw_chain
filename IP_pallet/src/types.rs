use frame_support::{pallet_prelude::*, traits::Currency};
use frame_system::pallet_prelude::*;

use crate::pallet::Config;
use sp_std::prelude::*;

pub type BalanceOf<T> =
    <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen, Debug)]
#[scale_info(skip_type_params(T))]
pub enum Offer<T: Config> {
    License(LicenseOffer<T>),
    Purchase(PurchaseOffer<T>),
}

#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen, Debug)]
pub enum ContractType {
    License,
    Purchase,
}

// Add a new enum for initiated contracts
#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen, Debug)]
#[scale_info(skip_type_params(T))]
pub enum Contract<T: Config> {
    License(License<T>),
    Purchase(PurchaseContract<T>),
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
                frequency,
            } => f
                .debug_struct("Periodic")
                .field("amount_per_payment", amount_per_payment)
                .field("total_payments", total_payments)
                .field("frequency", frequency)
                .finish(),
        }
    }
}

#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub enum LicenseStatus {
    Active,
    Completed,
    Revoked,
}

#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
pub enum PurchaseStatus {
    InProgress,
    Completed,
    Cancelled,
}

#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen, Debug)]
pub enum RevokeReason {
    PaymentFailure,
    TermsViolation,
    Other,
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

#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen, Debug)]
#[scale_info(skip_type_params(T))]
pub struct LicenseOffer<T: Config> {
    pub nft_id: T::NFTId,
    pub licensor: T::AccountId,
    pub payment_type: PaymentType<T>,
    pub is_exclusive: bool,
    pub duration: BlockNumberFor<T>,
}

#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen, Debug)]
#[scale_info(skip_type_params(T))]
pub struct PurchaseOffer<T: Config> {
    pub nft_id: T::NFTId,
    pub seller: T::AccountId,
    pub payment_type: PaymentType<T>,
}

#[derive(Clone, Encode, Decode, PartialEq, RuntimeDebug, TypeInfo, MaxEncodedLen)]
#[scale_info(skip_type_params(T))]
pub struct License<T: Config> {
    pub nft_id: T::NFTId,
    pub licensor: T::AccountId,
    pub licensee: T::AccountId,
    pub duration: BlockNumberFor<T>,
    pub start_block: BlockNumberFor<T>,
    pub payment_type: PaymentType<T>,
    pub payment_schedule: Option<PaymentSchedule<T>>,
    pub is_exclusive: bool,
    pub status: LicenseStatus,
}

#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen, Debug)]
#[scale_info(skip_type_params(T))]
pub struct PurchaseContract<T: Config> {
    pub nft_id: T::NFTId,
    pub seller: T::AccountId,
    pub buyer: T::AccountId,
    pub payment_type: PaymentType<T>,
    pub payment_schedule: Option<PaymentSchedule<T>>,
    pub status: PurchaseStatus,
}

#[derive(Clone, Encode, Decode, PartialEq, TypeInfo, MaxEncodedLen)]
#[scale_info(skip_type_params(T))]
pub struct PaymentSchedule<T: Config> {
    pub start_block: BlockNumberFor<T>,
    pub next_payment_block: BlockNumberFor<T>,
    pub payments_made: T::Index,
    pub payments_due: T::Index,
    pub missed_payments: Option<T::Index>,
    pub penalty_amount: Option<BalanceOf<T>>,
    pub frequency: BlockNumberFor<T>,
}


impl<T: Config> PaymentSchedule<T> {
    pub fn increment(&mut self) {
        self.next_payment_block = self.next_payment_block + self.frequency;
        self.payments_made = self.payments_made + 1u32.into();
        self.payments_due = self.payments_due - 1u32.into();
    }
}

impl<T: Config> core::fmt::Debug for PaymentSchedule<T>
where
    T::Index: core::fmt::Debug,
    BlockNumberFor<T>: core::fmt::Debug,
    BalanceOf<T>: core::fmt::Debug,
{
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        f.debug_struct("PaymentSchedule")
            .field("start_block", &self.start_block)
            .field("next_payment_block", &self.next_payment_block)
            .field("payments_made", &self.payments_made)
            .field("payments_due", &self.payments_due)
            .field("missed_payments", &self.missed_payments)
            .field("penalty_amount", &self.penalty_amount)
            .field("frequency", &self.frequency)
            .finish()
    }
}

impl<T: Config> LicenseOffer<T> {
    pub fn init(self, licensee: T::AccountId) -> License<T> {
        let start_block = frame_system::Pallet::<T>::block_number();
        // Create payment schedule based on payment type
        let payment_schedule = match &self.payment_type {
            PaymentType::Periodic {
                amount_per_payment: _,
                total_payments,
                frequency,
            } => Some(PaymentSchedule {
                start_block,
                next_payment_block: start_block,
                payments_made: T::Index::default(),
                payments_due: *total_payments,
                missed_payments: None,
                penalty_amount: None,
                frequency: *frequency,
            }),
            PaymentType::OneTime(_) => None,
        };

        License {
            nft_id: self.nft_id,
            licensor: self.licensor,
            licensee,
            duration: self.duration,
            start_block,
            payment_type: self.payment_type,
            payment_schedule,
            is_exclusive: self.is_exclusive,
            status: LicenseStatus::Active,
        }
    }
}

impl<T: Config> PurchaseOffer<T> {
    pub fn init(self, buyer: T::AccountId) -> PurchaseContract<T> {
        let start_block = frame_system::Pallet::<T>::block_number();
        // Create payment schedule based on payment type
        let payment_schedule = match &self.payment_type {
            PaymentType::Periodic {
                amount_per_payment: _,
                total_payments,
                frequency,
            } => Some(PaymentSchedule {
                start_block,
                next_payment_block: start_block,
                payments_made: T::Index::default(),
                payments_due: *total_payments,
                missed_payments: None,
                penalty_amount: None,
                frequency: *frequency,
            }),
            PaymentType::OneTime(_) => None,
        };

        PurchaseContract {
            nft_id: self.nft_id,
            seller: self.seller,
            buyer,
            payment_type: self.payment_type,
            payment_schedule,
            status: PurchaseStatus::InProgress,
        }
    }

}
