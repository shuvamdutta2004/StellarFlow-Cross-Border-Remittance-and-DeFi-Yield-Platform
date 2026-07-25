#![no_std]

use soroban_sdk::{contracttype, Address, String};

#[derive(Clone, Debug)]
#[contracttype]
pub struct SavingsRule {
    pub user: Address,
    pub auto_invest_bps: u32, // e.g. 2000 = 20%
    pub target_amount: i128,
    pub current_saved: i128,
    pub goal_name: String,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    UserRule(Address),
}
