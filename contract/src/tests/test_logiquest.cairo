use starknet::ContractAddress;
use starknet::{testing, contract_address_const};
use core::option::OptionTrait;
use core::traits::Into;
use core::array::ArrayTrait;
use contract::interface::{ILogiQuestDispatcher, ILogiQuestDispatcherTrait};


use snforge_std::{declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address, stop_cheat_caller_address};

use contract::interface::ILogiQuest;
use contract::types::{GameMode, AidsAllowed, AidsUsed};


// Test constants
const CLASSIC_MODE: u8 = 0;
const CHALLENGE_MODE: u8 = 1;
const DAILY_CHALLENGE_MODE: u8 = 2;
const TIME_BLITZ_MODE: u8 = 3;
const PUZZLE_MODE: u8 = 4;
const PRACTICE_MODE: u8 = 5;
const ADVENTURE_MODE: u8 = 6;
const ENDLESS_MODE: u8 = 7;

fn deploy_contract() -> ContractAddress {
    let contract = declare("LogiQuest").unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@ArrayTrait::new()).unwrap();
    contract_address
}


pub fn OWNER() -> ContractAddress {
    'owner'.try_into().unwrap()
}

pub fn PLAYER() -> ContractAddress {
    'player'.try_into().unwrap()
}


#[test]
fn test_initialize_game_modes() {

    let contract_address = deploy_contract();
    let dispatcher = ILogiQuestDispatcher { contract_address };
    
    dispatcher.initialize_game_modes();
    
    // Verify each game mode was initialized correctly
    // Classic Mode
    let classic_mode = dispatcher.get_game_modes(CLASSIC_MODE);
    assert(classic_mode.id == CLASSIC_MODE, 'Invalid classic mode ID');
    assert(classic_mode.name == 'Classic', 'Invalid classic mode name');
    assert(classic_mode.is_timed == false, 'Classic should not be timed');
    assert(classic_mode.has_levels == true, 'Classic should have levels');
    assert(classic_mode.is_daily == false, 'Classic should not be daily');
    assert(classic_mode.aids_allowed.audience_poll == true, 'Audience poll should be allowed');
    assert(classic_mode.aids_allowed.call_friend == true, 'Call friend should be allowed');
    assert(classic_mode.aids_allowed.fifty_fifty == true, '50:50 should be allowed');
    assert(classic_mode.base_reward == 100, 'Invalid base reward');
    
    // Daily Challenge Mode
    let daily_mode = dispatcher.get_game_modes(DAILY_CHALLENGE_MODE);
    assert(daily_mode.id == DAILY_CHALLENGE_MODE, 'Invalid daily mode ID');
    assert(daily_mode.name == 'Daily Challenge', 'Invalid daily mode name');
    assert(daily_mode.is_timed == true, 'Daily should be timed');
    assert(daily_mode.time_limit == 300, 'Daily should be 5 minutes');
    assert(daily_mode.has_levels == false, 'Daily should not have levels');
    assert(daily_mode.is_daily == true, 'Daily should be daily');
    assert(daily_mode.aids_allowed.audience_poll == false, 'Poll should not be allowed');
    assert(daily_mode.aids_allowed.call_friend == false, 'Call friend not allowed');
    assert(daily_mode.aids_allowed.fifty_fifty == true, '50:50 should be allowed');
    assert(daily_mode.base_reward == 300, 'Invalid base reward');
    
    // Time Blitz Mode
    let blitz_mode = dispatcher.get_game_modes(TIME_BLITZ_MODE);
    assert(blitz_mode.id == TIME_BLITZ_MODE, 'Invalid blitz mode ID');
    assert(blitz_mode.is_timed == true, 'Blitz should be timed');
    assert(blitz_mode.time_limit == 120, 'Blitz should be 2 minutes');
    assert(blitz_mode.has_levels == true, 'Blitz should have levels');
    assert(blitz_mode.time_bonus_multiplier == 1, 'Invalid time bonus multiplier');
}

#[test]
#[should_panic(expected: ('Game already initialized',))]
fn test_initialize_game_modes_twice_should_fail() {
    let contract_address = deploy_contract();
    let dispatcher = ILogiQuestDispatcher { contract_address };
    
    // Initialize game modes for the first time
    dispatcher.initialize_game_modes();
    
    // Trying to initialize again should fail
    dispatcher.initialize_game_modes();
}

#[test]
#[should_panic(expected: ('Invalid game mode ID',))]
fn test_get_invalid_game_mode() {
    let contract_address = deploy_contract();
    let dispatcher = ILogiQuestDispatcher { contract_address };
    
    dispatcher.initialize_game_modes();
    
    // Try to get an invalid game mode (there are only 8 modes, from 0 to 7)
    dispatcher.get_game_modes(8);
}

#[test]
fn test_player_progress_and_rewards() {
    let contract_address = deploy_contract();
    let dispatcher = ILogiQuestDispatcher { contract_address };
    
    dispatcher.initialize_game_modes();
    
    let player = PLAYER();
    
    // Start pranking to simulate the player
    start_cheat_caller_address(contract_address, player);
    
    // Create aids used
    let aids_used = AidsUsed {
        audience_poll: true,
        call_friend: false,
        fifty_fifty: true,
    };
    
    // Update player progress in Classic mode
    dispatcher.update_player_progress(
        player,
        CLASSIC_MODE,
        5, // level 5
        0, // day 0 (not used for this mode)
        aids_used,
        100 // rewards earned
    );
    
    // Check rewards
    let rewards = dispatcher.get_player_rewards(player);
    assert(rewards == 100, 'Invalid rewards');
    
    // Update progress in another mode
    dispatcher.update_player_progress(
        player,
        DAILY_CHALLENGE_MODE,
        0, // level 0 (not used for this mode)
        1, // day 1
        AidsUsed { audience_poll: false, call_friend: false, fifty_fifty: false },
        300 // rewards earned
    );
    
    // Check accumulated rewards
    let total_rewards = dispatcher.get_player_rewards(player);
    assert(total_rewards == 400, 'Invalid total rewards');
    
    // Stop pranking
    stop_cheat_caller_address(contract_address);
}

#[test]
fn test_all_game_modes_exist() {
    let contract_address = deploy_contract();
    let dispatcher = ILogiQuestDispatcher { contract_address };
    
    dispatcher.initialize_game_modes();
    
    // Check that all 8 game modes exist by requesting each one
    let modes = array![
        CLASSIC_MODE,
        CHALLENGE_MODE, 
        DAILY_CHALLENGE_MODE,
        TIME_BLITZ_MODE,
        PUZZLE_MODE,
        PRACTICE_MODE,
        ADVENTURE_MODE,
        ENDLESS_MODE
    ];
    
    let mut i: u32 = 0;
    while i < modes.len() {
        let mode_id = *modes.at(i);
        let mode = dispatcher.get_game_modes(mode_id);
        assert(mode.id == mode_id, 'Mode ID mismatch');
        
        i += 1;
    }
}