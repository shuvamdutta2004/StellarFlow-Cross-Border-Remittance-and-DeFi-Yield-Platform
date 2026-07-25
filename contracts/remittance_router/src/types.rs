use soroban_sdk::{contracttype, Address, String};

#[derive(Clone, Copy, PartialEq, Debug)]
#[contracttype]
pub enum RemittanceStatus {
    Pending = 0,
    Claimed = 1,
    Cancelled = 2,
    Refunded = 3,
}

#[derive(Clone, Debug)]
#[contracttype]
pub struct Remittance {
    pub id: u64,
    pub sender: Address,
    pub recipient: Address,
    pub amount: i128,
    pub fee: i128,
    pub source_token: Address,
    pub dest_token: Address,
    pub memo: String,
    pub status: RemittanceStatus,
    pub created_at: u64,
}

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    RemittanceCount,
    Remittance(u64),
    FeeBps,
    FeeVault,
}
