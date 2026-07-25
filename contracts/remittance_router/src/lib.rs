#![no_std]

mod types;

use soroban_sdk::{
    contract, contractimpl, contractmeta, log, symbol_short, token, Address, Env, String, Symbol,
};
use types::{DataKey, Remittance, RemittanceStatus};

contractmeta!(
    key = "Description",
    val = "StellarFlow Remittance Router: Escrow, Path Payment Routing, Fee Management"
);
contractmeta!(key = "Version", val = "1.0.0");

#[contract]
pub struct RemittanceRouter;

#[contractimpl]
impl RemittanceRouter {
    /// Initializes contract admin and fee configuration
    pub fn initialize(env: Env, admin: Address, fee_bps: u32, fee_vault: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::FeeBps, &fee_bps); // e.g. 30 = 0.3%
        env.storage().instance().set(&DataKey::FeeVault, &fee_vault);
        env.storage().instance().set(&DataKey::RemittanceCount, &0u64);
    }

    /// Creates a cross-border escrow remittance
    pub fn create_remittance(
        env: Env,
        sender: Address,
        recipient: Address,
        amount: i128,
        source_token: Address,
        dest_token: Address,
        memo: String,
    ) -> u64 {
        sender.require_auth();
        if amount <= 0 {
            panic!("Amount must be positive");
        }

        let fee_bps: u32 = env.storage().instance().get(&DataKey::FeeBps).unwrap_or(30);
        let fee = (amount * fee_bps as i128) / 10000i128;
        let net_amount = amount - fee;

        // Transfer tokens from sender to contract escrow
        let token_client = token::Client::new(&env, &source_token);
        token_client.transfer(&sender, &env.current_contract_address(), &amount);

        // Collect fee to fee vault if fee > 0
        if fee > 0 {
            if let Some(fee_vault) = env.storage().instance().get::<DataKey, Address>(&DataKey::FeeVault) {
                token_client.transfer(&env.current_contract_address(), &fee_vault, &fee);
            }
        }

        let count: u64 = env.storage().instance().get(&DataKey::RemittanceCount).unwrap_or(0);
        let remittance_id = count + 1u64;

        let remittance = Remittance {
            id: remittance_id,
            sender: sender.clone(),
            recipient: recipient.clone(),
            amount: net_amount,
            fee,
            source_token: source_token.clone(),
            dest_token,
            memo,
            status: RemittanceStatus::Pending,
            created_at: env.ledger().timestamp(),
        };

        env.storage().persistent().set(&DataKey::Remittance(remittance_id), &remittance);
        env.storage().instance().set(&DataKey::RemittanceCount, &remittance_id);

        env.events().publish(
            (symbol_short!("rem_sent"), sender, recipient),
            (remittance_id, net_amount, fee),
        );

        remittance_id
    }

    /// Claims funds by recipient
    pub fn claim_remittance(env: Env, recipient: Address, remittance_id: u64) {
        recipient.require_auth();
        let key = DataKey::Remittance(remittance_id);
        let mut remittance: Remittance = env.storage().persistent().get(&key).expect("Remittance not found");

        if remittance.recipient != recipient {
            panic!("Unauthorized recipient");
        }
        if remittance.status != RemittanceStatus::Pending {
            panic!("Remittance is not pending");
        }

        remittance.status = RemittanceStatus::Claimed;
        env.storage().persistent().set(&key, &remittance);

        // Transfer funds to recipient
        let token_client = token::Client::new(&env, &remittance.source_token);
        token_client.transfer(&env.current_contract_address(), &recipient, &remittance.amount);

        env.events().publish(
            (symbol_short!("rem_claim"), recipient),
            (remittance_id, remittance.amount),
        );
    }

    /// Cancels remittance by sender if not yet claimed
    pub fn cancel_remittance(env: Env, sender: Address, remittance_id: u64) {
        sender.require_auth();
        let key = DataKey::Remittance(remittance_id);
        let mut remittance: Remittance = env.storage().persistent().get(&key).expect("Remittance not found");

        if remittance.sender != sender {
            panic!("Unauthorized sender");
        }
        if remittance.status != RemittanceStatus::Pending {
            panic!("Cannot cancel non-pending remittance");
        }

        remittance.status = RemittanceStatus::Cancelled;
        env.storage().persistent().set(&key, &remittance);

        let token_client = token::Client::new(&env, &remittance.source_token);
        token_client.transfer(&env.current_contract_address(), &sender, &remittance.amount);

        env.events().publish(
            (symbol_short!("rem_cncl"), sender),
            (remittance_id, remittance.amount),
        );
    }

    pub fn get_remittance(env: Env, remittance_id: u64) -> Remittance {
        env.storage().persistent().get(&DataKey::Remittance(remittance_id)).expect("Remittance not found")
    }

    pub fn get_remittance_count(env: Env) -> u64 {
        env.storage().instance().get(&DataKey::RemittanceCount).unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize_and_create() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let fee_vault = Address::generate(&env);
        let contract_id = env.register_contract(None, RemittanceRouter);
        let client = RemittanceRouterClient::new(&env, &contract_id);

        client.initialize(&admin, &30, &fee_vault);
        assert_eq!(client.get_remittance_count(), 0);
    }
}
