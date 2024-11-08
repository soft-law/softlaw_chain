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
