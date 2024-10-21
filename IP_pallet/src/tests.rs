use crate::{mock::*, Error, Event};
use frame_support::{assert_noop, assert_ok};
use frame_system::{Origin};
use sp_core::H256;

// Helper function to get the last event
fn last_event() -> RuntimeEvent {
    frame_system::Pallet::<Test>::events()
        .pop()
        .expect("Event expected")
        .event
}

// Helper function to mint an NFT and return its ID
fn mint_nft(account: u64) -> H256 {
    let name = "name".to_string();
    let description = "description".to_string();
    let filing_date = "filing_date".to_string();
    let jurisdiction = "jurisdiction".to_string();

    assert_ok!(IPPallet::mint_nft(
        Origin::<Test>::Signed(account).into(),
        name,
        description,
        filing_date,
        jurisdiction
    ));

    // Extract the NFT ID from the emitted event
    if let RuntimeEvent::IPPallet(Event::NftMinted { nft_id, .. }) = last_event() {
        nft_id
    } else {
        panic!("Expected NftMinted event");
    }
}

#[test]
fn test_mint_nft() {
    new_test_ext().execute_with(|| {
        let account = 1;
        let nft_id = mint_nft(account);

        // Check that the NFT was created
        assert!(IPPallet::nfts(nft_id).is_some());

        // Check that the event was emitted
        assert_eq!(
            last_event(),
            RuntimeEvent::IPPallet(Event::NftMinted {
                owner: account,
                nft_id,
                name: vec![0; 10],
                number: 0
            })
        );
    });
}

#[test]
fn test_mint_nft_name_too_long() {
    new_test_ext().execute_with(|| {
        let account = 1;
        let name = "name".repeat(51); // MaxNameLength is 50
        let description = "description".to_string();
        let filing_date = "filing_date".to_string();
        let jurisdiction = "jurisdiction".to_string();

        assert_noop!(
            IPPallet::mint_nft(
                Origin::<Test>::Signed(account).into(),
                name,
                description,
                filing_date,
                jurisdiction
            ),
            Error::<Test>::NameTooLong
        );
    });
}

#[test]
fn test_escrow_nft() {
    new_test_ext().execute_with(|| {
        let account = 1;
        let nft_id = mint_nft(account);
        let price = 100;

        assert_ok!(IPPallet::escrow_nft(
            Origin::<Test>::Signed(account).into(),
            nft_id,
            price
        ));

        // Check that the NFT is in escrow
        assert!(IPPallet::escrow(nft_id).is_some());

        // Check that the event was emitted
        frame_system::Pallet::<Test>::assert_last_event(
            Event::NftEscrowed {
                nft_id,
                owner: account,
                price,
            }
            .into(),
        );
    });
}

#[test]
fn test_escrow_nft_not_owner() {
    new_test_ext().execute_with(|| {
        let account1 = 1;
        let account2 = 2;
        let nft_id = mint_nft(account1);
        let price = 100;

        assert_noop!(
            IPPallet::escrow_nft(Origin::<Test>::Signed(account2).into(), nft_id, price),
            Error::<Test>::NotNftOwner
        );
    });
}

#[test]
fn test_escrow_nft_already_escrowed() {
    new_test_ext().execute_with(|| {
        let account = 1;
        let nft_id = mint_nft(account);
        let price = 100;

        assert_ok!(IPPallet::escrow_nft(
            Origin::<Test>::Signed(account).into(),
            nft_id,
            price
        ));

        assert_noop!(
            IPPallet::escrow_nft(Origin::<Test>::Signed(account).into(), nft_id, price),
            Error::<Test>::NftAlreadyEscrowed
        );
    });
}

#[test]
fn test_escrow_nft_not_found() {
    new_test_ext().execute_with(|| {
        let account = 1;
        let nft_id = H256::from_low_u64_be(999); // Non-existent NFT
        let price = 100;

        assert_noop!(
            IPPallet::escrow_nft(Origin::<Test>::Signed(account).into(), nft_id, price),
            Error::<Test>::NftNotFound
        );
    });
}
