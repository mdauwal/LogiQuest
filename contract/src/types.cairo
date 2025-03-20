use starknet::ContractAddress;

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct GameMode {
    id: u8,
    name: felt252,
    description: felt252,

    // Game mode properties
    is_timed: bool,
    time_limit: u32,
    has_levels: bool,
    is_daily: bool,
    aids_allowed: AidsAllowed,

    // Reward Information
    base_reward: u256,
    time_bonus: u256,
    time_bonus_multiplier: u8,
    consecutive_bonus: u8,

}


#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct AidsAllowed {
    audience_poll: bool,
    call_friend: bool,  
    fifty_fifty: bool,  
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct AidsUsed {
    audience_poll: bool,  
    call_friend: bool,  
    fifty_fifty: bool,  
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct PlayerProgress {
    mode_id: u8,  
    session_level: u32, 
    day: u32,  
    aids_used: AidsUsed,  
    total_rewards: u256,  
}