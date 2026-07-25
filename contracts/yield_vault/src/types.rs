#![no_std]

use soroban_sdk::{contracttype, Address};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    UnderlyingToken,
    TotalShares,
    TotalAssets,
    UserShares(Address),
    ApyBps,
}

#[derive(Clone, Debug)]
#[contracttype]
pub struct VaultStats {
    pub total_assets: i128,
    pub total_shares: i128,
    pub apy_bps: u32,
}
