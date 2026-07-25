#![no_std]

mod types;

use soroban_sdk::{
    contract, contractimpl, contractmeta, symbol_short, Address, Env, String,
};
use types::{DataKey, SavingsRule};

contractmeta!(
    key = "Description",
    val = "StellarFlow Savings Goal Contract: Auto-invest Rule Engine"
);
contractmeta!(key = "Version", val = "1.0.0");

#[contract]
pub struct SavingsGoal;

#[contractimpl]
impl SavingsGoal {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Already initialized");
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
    }

    pub fn set_rule(
        env: Env,
        user: Address,
        auto_invest_bps: u32,
        target_amount: i128,
        goal_name: String,
    ) {
        user.require_auth();
        if auto_invest_bps > 10000 {
            panic!("Auto-invest percentage cannot exceed 100%");
        }

        let key = DataKey::UserRule(user.clone());
        let current_saved = if let Some(rule) = env.storage().persistent().get::<DataKey, SavingsRule>(&key) {
            rule.current_saved
        } else {
            0i128
        };

        let new_rule = SavingsRule {
            user: user.clone(),
            auto_invest_bps,
            target_amount,
            current_saved,
            goal_name,
        };

        env.storage().persistent().set(&key, &new_rule);

        env.events().publish(
            (symbol_short!("rule_set"), user),
            (auto_invest_bps, target_amount),
        );
    }

    pub fn record_savings(env: Env, user: Address, amount: i128) {
        let key = DataKey::UserRule(user.clone());
        if let Some(mut rule) = env.storage().persistent().get::<DataKey, SavingsRule>(&key) {
            rule.current_saved += amount;
            env.storage().persistent().set(&key, &rule);

            env.events().publish(
                (symbol_short!("save_add"), user),
                (amount, rule.current_saved),
            );
        }
    }

    pub fn get_rule(env: Env, user: Address) -> Option<SavingsRule> {
        env.storage().persistent().get(&DataKey::UserRule(user))
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, String, Env};

    #[test]
    fn test_savings_rule() {
        let env = Env::default();
        env.mock_all_auths();

        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        let contract_id = env.register_contract(None, SavingsGoal);
        let client = SavingsGoalClient::new(&env, &contract_id);

        client.initialize(&admin);
        let goal_name = String::from_str(&env, "Emergency Fund");
        client.set_rule(&user, &2000, &1000000000, &goal_name);

        let rule = client.get_rule(&user).unwrap();
        assert_eq!(rule.auto_invest_bps, 2000);
        assert_eq!(rule.target_amount, 1000000000);
    }
}
