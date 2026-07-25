#![no_std]

mod types;

use soroban_sdk::{
    contract, contractimpl, contractmeta, symbol_short, token, Address, Env,
};
use types::{DataKey, VaultStats};

contractmeta!(
    key = "Description",
    val = "StellarFlow Soroban Yield Vault: SEP-41 Token Vault with Lending APY Accrual"
);
contractmeta!(key = "Version", val = "1.0.0");

#[contract]
pub struct YieldVault;

#[contractimpl]
impl YieldVault {
    pub fn initialize(env: Env, admin: Address, token: Address, apy_bps: u32) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::UnderlyingToken, &token);
        env.storage().instance().set(&DataKey::TotalAssets, &0i128);
        env.storage().instance().set(&DataKey::TotalShares, &0i128);
        env.storage().instance().set(&DataKey::ApyBps, &apy_bps); // e.g. 840 = 8.40%
    }

    pub fn deposit(env: Env, depositor: Address, amount: i128) -> i128 {
        depositor.require_auth();
        if amount <= 0 {
            panic!("Deposit amount must be positive");
        }

        let token_addr: Address = env.storage().instance().get(&DataKey::UnderlyingToken).unwrap();
        let token_client = token::Client::new(&env, &token_addr);

        // Transfer underlying token from depositor to vault
        token_client.transfer(&depositor, &env.current_contract_address(), &amount);

        let total_assets: i128 = env.storage().instance().get(&DataKey::TotalAssets).unwrap_or(0);
        let total_shares: i128 = env.storage().instance().get(&DataKey::TotalShares).unwrap_or(0);

        let shares_minted = if total_shares == 0 || total_assets == 0 {
            amount
        } else {
            (amount * total_shares) / total_assets
        };

        let user_key = DataKey::UserShares(depositor.clone());
        let current_user_shares: i128 = env.storage().persistent().get(&user_key).unwrap_or(0);

        env.storage().persistent().set(&user_key, &(current_user_shares + shares_minted));
        env.storage().instance().set(&DataKey::TotalAssets, &(total_assets + amount));
        env.storage().instance().set(&DataKey::TotalShares, &(total_shares + shares_minted));

        env.events().publish(
            (symbol_short!("vault_dep"), depositor),
            (amount, shares_minted),
        );

        shares_minted
    }

    pub fn withdraw(env: Env, depositor: Address, shares: i128) -> i128 {
        depositor.require_auth();
        if shares <= 0 {
            panic!("Shares must be positive");
        }

        let user_key = DataKey::UserShares(depositor.clone());
        let current_user_shares: i128 = env.storage().persistent().get(&user_key).unwrap_or(0);
        if current_user_shares < shares {
            panic!("Insufficient shares");
        }

        let total_assets: i128 = env.storage().instance().get(&DataKey::TotalAssets).unwrap_or(0);
        let total_shares: i128 = env.storage().instance().get(&DataKey::TotalShares).unwrap_or(0);

        let amount_returned = (shares * total_assets) / total_shares;

        env.storage().persistent().set(&user_key, &(current_user_shares - shares));
        env.storage().instance().set(&DataKey::TotalAssets, &(total_assets - amount_returned));
        env.storage().instance().set(&DataKey::TotalShares, &(total_shares - shares));

        let token_addr: Address = env.storage().instance().get(&DataKey::UnderlyingToken).unwrap();
        let token_client = token::Client::new(&env, &token_addr);
        token_client.transfer(&env.current_contract_address(), &depositor, &amount_returned);

        env.events().publish(
            (symbol_short!("vault_wdr"), depositor),
            (shares, amount_returned),
        );

        amount_returned
    }

    pub fn get_user_shares(env: Env, depositor: Address) -> i128 {
        env.storage().persistent().get(&DataKey::UserShares(depositor)).unwrap_or(0)
    }

    pub fn get_vault_stats(env: Env) -> VaultStats {
        VaultStats {
            total_assets: env.storage().instance().get(&DataKey::TotalAssets).unwrap_or(0),
            total_shares: env.storage().instance().get(&DataKey::TotalShares).unwrap_or(0),
            apy_bps: env.storage().instance().get(&DataKey::ApyBps).unwrap_or(840),
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_vault_init() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let token = Address::generate(&env);
        let contract_id = env.register_contract(None, YieldVault);
        let client = YieldVaultClient::new(&env, &contract_id);

        client.initialize(&admin, &token, &840);
        let stats = client.get_vault_stats();
        assert_eq!(stats.apy_bps, 840);
        assert_eq!(stats.total_assets, 0);
    }
}
