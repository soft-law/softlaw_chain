#![cfg(feature = "runtime-benchmarks")]

use super::*;
use frame_benchmarking::{benchmarks, whitelisted_caller, impl_benchmark_test_suite};
use frame_system::RawOrigin;
use sp_std::prelude::*;
use frame_support::traits::Get;

benchmarks! {
    mint_nft {
        let caller: T::AccountId = whitelisted_caller();
        let name: Vec<u8> = vec![0; T::MaxNameLength::get() as usize];
        let description: Vec<u8> = vec![0; T::MaxDescriptionLength::get() as usize];
        let filing_date: Vec<u8> = vec![0; T::MaxNameLength::get() as usize];
        let jurisdiction: Vec<u8> = vec![0; T::MaxNameLength::get() as usize];
    }: _(RawOrigin::Signed(caller), name, description, filing_date, jurisdiction)
    verify {
        assert_eq!(NextNftId::<T>::get(), 1);
    }
}

impl_benchmark_test_suite!(
    Pallet,
    crate::mock::new_test_ext(),
    crate::mock::Test,
);