
#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct GameMode {
    pub id: u8,
    pub name: felt252,
    pub description: felt252,

    // Game mode properties
    pub is_timed: bool,
    pub time_limit: u32,
    pub has_levels: bool,
    pub is_daily: bool,
    pub aids_allowed: AidsAllowed,

    // Reward Information
    pub base_reward: u256,
    pub time_bonus: u256,
    pub time_bonus_multiplier: u8,
    pub consecutive_bonus: u8,

}


#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct AidsAllowed {
    pub audience_poll: bool,
    pub call_friend: bool,  
    pub fifty_fifty: bool,  
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct AidsUsed {
    pub audience_poll: bool,  
    pub call_friend: bool,  
    pub fifty_fifty: bool,  
}

#[derive(Copy, Drop, Serde, starknet::Store)]
pub struct PlayerProgress {
    pub mode_id: u8,  
    pub session_level: u32, 
    pub day: u32,  
    pub aids_used: AidsUsed,  
    pub total_rewards: u256,  
}