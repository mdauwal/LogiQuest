use contract::types::{AidsUsed, GameMode};
use starknet::ContractAddress;

#[starknet::interface]
pub trait ILogiQuest<TContractState> {
    fn initialize_game_modes(ref self: TContractState);
    fn get_game_modes(self: @TContractState, mode_id: u8) -> GameMode;
    fn update_player_progress(
        ref self: TContractState,
        player: ContractAddress,
        mode_id: u8,
        session_level: u32,
        day: u32,
        aids_used: AidsUsed,
        rewards_earned: u256,
    );
    fn get_player_rewards(self: @TContractState, player: ContractAddress) -> u256;
}
