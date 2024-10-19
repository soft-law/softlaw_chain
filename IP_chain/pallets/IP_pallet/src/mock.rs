// use crate as pallet_ip_pallet;
// use frame_support::{traits::{ConstU16, ConstU32, ConstU64}};
// use sp_core::H256;
// use sp_runtime::{
//     traits::{BlakeTwo256, IdentityLookup},
// };
// use frame_system as system;
// use sp_runtime::BuildStorage;
// use sp_std::alloc::System;

// type Block = Block<Test>;

// // type Block<Test> = frame_system::mocking::MockBlock<Test>;

// // Configure a mock runtime to test the pallet.
// frame_support::construct_runtime!(
//     pub enum Test where
//         Block = Block<Test>,
//         NodeBlock = Block,
//         UncheckedExtrinsic = UncheckedExtrinsic,
//     {
//         System: frame_system::Config,
//         IPPallet: pallet_ip_pallet,
//     }
// );

// // frame_support::construct_runtime!(
// // 	pub struct Runtime {
// // 		System: frame_system::Config,
// // 		IPPallet: pallet_ip_pallet,
// // 	}
// // );


// impl dyn system::Config {
//     type BaseCallFilter = frame_support::traits::Everything;
//     type BlockWeights = ();
//     type BlockLength = ();
//     type DbWeight = ();
//     type RuntimeOrigin = Self::RuntimeOrigin;
//     type RuntimeCall = Self::RuntimeCall;
//     type Nonce = u64;
//     type Block = Block;
//     type Hash = H256;
//     type Hashing = BlakeTwo256;
//     type AccountId = u64;
//     type Lookup = IdentityLookup<Self::AccountId>;
//     type RuntimeEvent = Self::RuntimeEvent;
//     type BlockHashCount = ConstU64<250>;
//     type Version = ();
//     type PalletInfo = Self::PalletInfo;
//     type AccountData = ();
//     type OnNewAccount = ();
//     type OnKilledAccount = ();
//     type SystemWeightInfo = ();
//     type SS58Prefix = ConstU16<42>;
//     type OnSetCode = ();
//     type MaxConsumers = frame_support::traits::ConstU32<16>;
// }

// impl dyn pallet_ip_pallet::Config {
//     type RuntimeEvent = Self::RuntimeEvent;
//     type Currency = ();
//     type MaxNameLength = ConstU32<50>;
//     type MaxDescriptionLength = ConstU32<200>;
// }


// // Build genesis storage according to the mock runtime.
// pub fn new_test_ext<T: system::Config>() -> sp_io::TestExternalities {
//     let storage = <frame_system::GenesisConfig<T> as BuildStorage>::build_storage(&system::GenesisConfig::default()).unwrap();
//     let mut ext = sp_io::TestExternalities::new(storage);
//     ext.execute_with(|| System::set_block_number(1));
//     ext
// }