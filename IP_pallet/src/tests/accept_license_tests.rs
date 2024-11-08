use crate::{
    mock::*,
    pallet::{Error, Event},
    types::{Contract, License, LicenseStatus, NFT, Offer, PaymentType},
};
use frame_support::{assert_noop, assert_ok};

// Helper functions
fn create_nft(owner: u64) -> u32 {
    let origin = RuntimeOrigin::signed(owner);
    assert_ok!(IPPallet::mint_nft(
        origin,
        "Test NFT".into(),
        "Test Description".into(),
        "2023-05-01".into(),
        "Test Jurisdiction".into()
    ));
    IPPallet::next_nft_id() - 1
}

fn create_periodic_payment_type() -> PaymentType<Test> {
    PaymentType::Periodic {
        amount_per_payment: 100u32.into(),
        total_payments: 10u32,
        frequency: 10u32.into(),
    }
}

fn create_one_time_payment_type() -> PaymentType<Test> {
    PaymentType::OneTime(1000u32.into())
}

// Failure Tests
#[test]
fn fail_accept_nonexistent_offer() {
    new_test_ext().execute_with(|| {
        let licensee = 2u64;
        assert_noop!(
            IPPallet::accept_license(RuntimeOrigin::signed(licensee), 999u32),
            Error::<Test>::OfferNotFound
        );
    });
}

#[test]
fn fail_accept_wrong_offer_type() {
    new_test_ext().execute_with(|| {
        let owner = 1u64;
        let licensee = 2u64;
        let nft_id = create_nft(owner);

        // Create purchase offer
        assert_ok!(IPPallet::offer_purchase(
            RuntimeOrigin::signed(owner),
            nft_id,
            create_one_time_payment_type(),
        ));
        let offer_id = IPPallet::next_offer_id() - 1;

        // Try to accept as license
        assert_noop!(
            IPPallet::accept_license(RuntimeOrigin::signed(licensee), offer_id),
            Error::<Test>::NotALicenseOffer
        );
    });
}

// Success Tests
#[test]
fn success_accept_onetime_license() {
    new_test_ext().execute_with(|| {
        let owner = 1u64;
        let licensee = 2u64;
        let nft_id = create_nft(owner);

        // Create license offer
        assert_ok!(IPPallet::offer_license(
            RuntimeOrigin::signed(owner),
            nft_id,
            create_one_time_payment_type(),
            false, // non-exclusive
            100u32.into()
        ));
        let offer_id = IPPallet::next_offer_id() - 1;

        // Accept offer
        assert_ok!(IPPallet::accept_license(
            RuntimeOrigin::signed(licensee),
            offer_id
        ));

        // Verify contract created
        let contracts = IPPallet::nft_contracts(nft_id);
        assert_eq!(contracts.len(), 1);
        let contract_id = contracts[0];

        // Verify contract details
        if let Some(Contract::License(license)) = IPPallet::contracts(contract_id) {
            assert_eq!(license.licensee, licensee);
            assert_eq!(license.licensor, owner);
            assert_eq!(license.nft_id, nft_id);
            assert_eq!(license.status, LicenseStatus::Active);
            assert_eq!(license.payment_schedule, None); // One-time payment has no schedule
        } else {
            panic!("Contract not found or wrong type");
        }

        // Verify events
        System::assert_has_event(RuntimeEvent::IPPallet(Event::LicenseAccepted {
            offer_id,
            licensee,
        }));
    });
}

#[test]
fn success_accept_periodic_license() {
    new_test_ext().execute_with(|| {
        let owner = 1u64;
        let licensee = 2u64;
        let nft_id = create_nft(owner);

        // Create periodic license offer
        assert_ok!(IPPallet::offer_license(
            RuntimeOrigin::signed(owner),
            nft_id,
            create_periodic_payment_type(),
            false,
            100u32.into()
        ));
        let offer_id = IPPallet::next_offer_id() - 1;

        // Accept offer
        assert_ok!(IPPallet::accept_license(
            RuntimeOrigin::signed(licensee),
            offer_id
        ));

        // Verify contract created
        let contracts = IPPallet::nft_contracts(nft_id);
        assert_eq!(contracts.len(), 1);
        let contract_id = contracts[0];

        // Verify contract details
        if let Some(Contract::License(license)) = IPPallet::contracts(contract_id) {
            assert_eq!(license.licensee, licensee);
            assert_eq!(license.licensor, owner);
            assert_eq!(license.nft_id, nft_id);
            assert_eq!(license.status, LicenseStatus::Active);
            assert!(license.payment_schedule.is_some()); // Periodic payment has schedule
            
            let schedule = license.payment_schedule.unwrap();
            assert_eq!(schedule.payments_made, 0u32);
            assert_eq!(schedule.payments_due, 10u32);
            assert!(schedule.missed_payments.is_none());
            assert!(schedule.penalty_amount.is_none());
        } else {
            panic!("Contract not found or wrong type");
        }

        // Verify events
        System::assert_has_event(RuntimeEvent::IPPallet(Event::LicenseAccepted {
            offer_id,
            licensee,
        }));
    });
}
