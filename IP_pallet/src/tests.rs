use crate::{mock::*, Event};
use frame_support::{ assert_ok};


#[test]
fn test_mint_nft() {
    new_test_ext().execute_with(|| {
        let account_id = 1;
        let origin = RuntimeOrigin::signed(account_id);
        
        assert_ok!(IPPallet::mint_nft(
            origin,
            "Test NFT".into(),
            "Test Description".into(),
            "2023-05-01".into(),
            "Test Jurisdiction".into()
        ));

        let nft_id = IPPallet::next_nft_id() - 1;

        // Assert storage NFT is Some
        assert!(IPPallet::nfts(nft_id).is_some());

        // Assert next_nft_id is updated
        assert_eq!(IPPallet::next_nft_id(), nft_id + 1);

        // Assert the event is emitted with owner and nft_id
        let expected_event = RuntimeEvent::IPPallet(Event::NftMinted { 
            owner: account_id, 
            nft_id
        });
        assert!(System::events().iter().any(|record| record.event == expected_event));
    });
}

// #[test]
// fn test_mint_nft_name_too_long() {
//     new_test_ext().execute_with(|| {
//         let account = 1;
//         let name = "name".repeat(51); // MaxNameLength is 50
//         let description = "description".to_string();
//         let filing_date = "filing_date".to_string();
//         let jurisdiction = "jurisdiction".to_string();

//         assert_noop!(
//             IPPallet::mint_nft(
//                 Origin::<Test>::Signed(account).into(),
//                 name,
//                 description,
//                 filing_date,
//                 jurisdiction
//             ),
//             Error::<Test>::NameTooLong
//         );
//     });
// }

// #[test]
// fn test_escrow_nft() {
//     new_test_ext().execute_with(|| {
//         let account = 1;
//         let nft_id = mint_nft(account);
//         let price = 100;

//         assert_ok!(IPPallet::escrow_nft(
//             Origin::<Test>::Signed(account).into(),
//             nft_id,
//             price
//         ));

//         // Check that the NFT is in escrow
//         assert!(IPPallet::escrow(nft_id).is_some());

//         // Check that the event was emitted
//         assert_eq!(
//             last_event(),
//             RuntimeEvent::IPPallet(Event::NftEscrowed {
//                 nft_id,
//                 owner: account,
//                 price,
//             })
//         );
//     });
// }

// #[test]
// fn test_escrow_nft_not_owner() {
//     new_test_ext().execute_with(|| {
//         let account1 = 1;
//         let account2 = 2;
//         let nft_id = mint_nft(account1);
//         let price = 100;

//         assert_noop!(
//             IPPallet::escrow_nft(Origin::<Test>::Signed(account2).into(), nft_id, price),
//             Error::<Test>::NotNftOwner
//         );
//     });
// }

// #[test]
// fn test_escrow_nft_already_escrowed() {
//     new_test_ext().execute_with(|| {
//         let account = 1;
//         let nft_id = mint_nft(account);
//         let price = 100;

//         assert_ok!(IPPallet::escrow_nft(
//             Origin::<Test>::Signed(account).into(),
//             nft_id,
//             price
//         ));

//         assert_noop!(
//             IPPallet::escrow_nft(Origin::<Test>::Signed(account).into(), nft_id, price),
//             Error::<Test>::NftAlreadyEscrowed
//         );
//     });
// }

// #[test]
// fn test_escrow_nft_not_found() {
//     new_test_ext().execute_with(|| {
//         let account = 1;
//         let nft_id = 999; // Non-existent NFT
//         let price = 100;

//         assert_noop!(
//             IPPallet::escrow_nft(Origin::<Test>::Signed(account).into(), nft_id, price),
//             Error::<Test>::NftNotFound
//         );
//     });
// }
