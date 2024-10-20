use crate::{mock::*, Error, Event, Pallet as IPPallet};
use frame_support::{assert_noop, assert_ok};
use sp_core::H256;
use frame_system::Origin;
use sp_std::alloc::System;

// Helper function to mint an NFT and return its ID
fn mint_nft(account: u64) -> H256 {
    let name = vec![0; 10];
    let description = vec![0; 20];
    let filing_date = vec![0; 10];
    let jurisdiction = vec![0; 10];
    assert_ok!(IPPallet::mint_nft(Origin::Signed(account).into(), name, description, filing_date, jurisdiction));
    let nft_id = H256::from_low_u64_be(IPPallet::next_nft_id() as u64 - 1);
    nft_id
}

#[test]
fn test_mint_nft() {
    new_test_ext().execute_with(|| {
        let account = 1;
        let nft_id = mint_nft(account);

        // Check that the NFT was created
        assert!(IPPallet::nfts(nft_id).is_some());

        // Check that the event was emitted
        System::assert_last_event(Event::NftMinted { owner: account, nft_id, name: vec![0; 10], number: 0 }.into());
    });
}

#[test]
fn test_mint_nft_name_too_long<Test>() {
    new_test_ext().execute_with(|| {
        let account = 1;
        let name = vec![0; 51]; // MaxNameLength is 50
        let description = vec![0; 20];
        let filing_date = vec![0; 10];
        let jurisdiction = vec![0; 10];

        assert_noop!(
            IPPallet::mint_nft(Origin::Signed(account).into(), name, description, filing_date, jurisdiction),
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

        assert_ok!(IPPallet::escrow_nft(Origin::Signed(account).into(), nft_id, price));

        // Check that the NFT is in escrow
        assert!(IPPallet::escrow(nft_id).is_some());

        // Check that the event was emitted
        System::assert_last_event(Event::NftEscrowed { nft_id, owner: account, price }.into());
    });
}

#[test]
fn test_escrow_nft_not_owner<Test>() {
    new_test_ext().execute_with(|| {
        let account1 = 1;
        let account2 = 2;
        let nft_id = mint_nft(account1);
        let price = 100;

        assert_noop!(
            IPPallet::escrow_nft(Origin::Signed(account2).into(), nft_id, price),
            Error::<Test>::NotNftOwner
        );
    });
}

#[test]
fn test_escrow_nft_already_escrowed<Test>() {
    new_test_ext().execute_with(|| {
        let account = 1;
        let nft_id = mint_nft(account);
        let price = 100;

        assert_ok!(IPPallet::escrow_nft(Origin::Signed(account).into(), nft_id, price));

        assert_noop!(
            IPPallet::escrow_nft(Origin::Signed(account).into(), nft_id, price),
            Error::<Test>::NftAlreadyEscrowed
        );
    });
}

#[test]
fn test_escrow_nft_not_found<Test>() {
    new_test_ext().execute_with(|| {
        let account = 1;
        let nft_id = H256::from_low_u64_be(999); // Non-existent NFT
        let price = 100;

        assert_noop!(
            IPPallet::escrow_nft(Origin::Signed(account).into(), nft_id, price),
            Error::<Test>::NftNotFound
        );
    });
}