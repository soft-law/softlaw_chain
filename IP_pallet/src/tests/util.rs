use crate::types::*;
use crate::{mock::*, pallet::Config};
use frame_system::pallet_prelude::BlockNumberFor;
pub fn create_offer(
    licensor: <Test as frame_system::Config>::AccountId,
    nft_id: <Test as Config>::NFTId,
    is_exclusive: bool,
    payment_type: PaymentType<Test>,
    duration: Option<BlockNumberFor<Test>>,
) -> <Test as Config>::OfferId {
    IPPallet::offer_license(
        RuntimeOrigin::signed(licensor),
        nft_id,
        payment_type,
        is_exclusive,
        duration.unwrap(),
    )
    .unwrap();
    IPPallet::next_offer_id() - 1
}

pub fn create_nft(owner: <Test as frame_system::Config>::AccountId) -> <Test as Config>::NFTId {
    let origin = RuntimeOrigin::signed(owner);
    IPPallet::mint_nft(
        origin,
        "Test NFT".into(),
        "Test Description".into(),
        "2023-05-01".into(),
        "Test Jurisdiction".into()
    ).unwrap();
    IPPallet::next_nft_id() - 1
}

pub fn create_periodic_payment_type() -> PaymentType<Test> {
    PaymentType::Periodic {
        amount_per_payment: 100u32.into(),
        total_payments: 10u32,
        frequency: 10u32.into(),
    }
}

pub fn create_one_time_payment_type() -> PaymentType<Test> {
    PaymentType::OneTime(1000u32.into())
}
