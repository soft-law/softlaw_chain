use crate::pallet::Event;
use crate::types::*;
use crate::{mock::*, pallet::Config};

pub fn create_nft(owner: <Test as frame_system::Config>::AccountId) -> <Test as Config>::NFTId {
    let origin = RuntimeOrigin::signed(owner);
    IPPallet::mint_nft(
        origin,
        "Test NFT".into(),
        "Test Description".into(),
        "2023-05-01".into(),
        "Test Jurisdiction".into(),
    )
    .unwrap();
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

pub fn get_last_event_offer_id() -> <Test as Config>::OfferId {
    match System::events().last().unwrap().event {
        RuntimeEvent::IPPallet(Event::PurchaseOffered { offer_id, .. })
        | RuntimeEvent::IPPallet(Event::LicenseOffered { offer_id, .. }) => offer_id,
        _ => panic!("Expected Offer event"),
    }
}
