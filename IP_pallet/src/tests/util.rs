use crate::types::*;
use crate::{mock::*, pallet::Config};
use frame_system::pallet_prelude::BlockNumberFor;
pub fn create_license(
    licensor: <Test as frame_system::Config>::AccountId,
    nft_id: <Test as Config>::NFTId,
    is_exclusive: bool,
    payment_type: PaymentType<Test>,
    duration: Option<BlockNumberFor<Test>>,
) -> <Test as Config>::LicenseId {
    IPPallet::create_license(
        RuntimeOrigin::signed(licensor),
        nft_id,
        false,
        duration,
        payment_type,
        is_exclusive,
    )
    .unwrap();
    IPPallet::next_license_id() - 1
}
