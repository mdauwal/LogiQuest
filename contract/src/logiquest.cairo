
#[starknet::contract]
mod LogiQuest {
    use starknet::{ContractAddress, get_caller_address};
    use contract::types::{GameMode, AidsUsed, AidsAllowed, PlayerProgress};
    use contract::interface::ILogiQuest;
    use starknet::storage::{
        StoragePointerReadAccess, StoragePointerWriteAccess, Map,
    };


    #[storage]
    struct Storage {
        game_modes: Map<u8, GameMode>,
        player_progress: Map<(ContractAddress, u8), PlayerProgress>, // (player, mode_id) -> progress
        player_total_rewards: Map<ContractAddress, u256>,
        initialize: bool,
    }

     // Constants for game mode IDs
     const CLASSIC_MODE: u8 = 0;
     const CHALLENGE_MODE: u8 = 1;
     const DAILY_CHALLENGE_MODE: u8 = 2;
     const TIME_BLITZ_MODE: u8 = 3;
     const PUZZLE_MODE: u8 = 4;
     const PRACTICE_MODE: u8 = 5;
     const ADVENTURE_MODE: u8 = 6;
     const ENDLESS_MODE: u8 = 7;


     #[abi(embed_v0)]
     impl LogiQuest of ILogiQuest<ContractState> {

        fn initialize_game_modes(ref self: ContractState) {
            
            assert(!self.initialize.read(), 'Game already initialized');

            self.game_modes.write(
                CLASSIC_MODE,
                GameMode {
                    id: CLASSIC_MODE,
                    name: 'Classic',
                    description: 'Traditional LogiQuest gameplay',
                    is_timed: false,
                    time_limit: 0,
                    has_levels: true,
                    is_daily: false,
                    aids_allowed: AidsAllowed {
                        audience_poll: false,
                        call_friend: false,
                        fifty_fifty: false,
                    },
                    base_reward: 100,
                    time_bonus: 0,
                    time_bonus_multiplier: 0,
                    consecutive_bonus: 10,
                }
            );

            self.game_modes.write(
                CHALLENGE_MODE,
                GameMode {
                    id: CHALLENGE_MODE,
                    name: 'Challenge',
                    description: 'More difficult puzzles',
                    is_timed: true,
                    time_limit: 60,
                    has_levels: false,
                    is_daily: false,
                    aids_allowed: AidsAllowed {
                        audience_poll: true,
                        call_friend: true,
                        fifty_fifty: true,
                    },
                    base_reward: 200,
                    time_bonus: 0,
                    time_bonus_multiplier: 1,
                    consecutive_bonus: 20,
                }
            );

            self.game_modes.write(
                DAILY_CHALLENGE_MODE,
                GameMode {
                    id: DAILY_CHALLENGE_MODE,
                    name: 'Daily Challenge',
                    description: 'Daily challenge mode',
                    is_timed: true,
                    time_limit: 300,
                    has_levels: false,
                    is_daily: true,
                    aids_allowed: AidsAllowed {
                        audience_poll: true,
                        call_friend: true,
                        fifty_fifty: true,
                    },
                    base_reward: 300,
                    time_bonus: 0,
                    time_bonus_multiplier: 1,
                    consecutive_bonus: 50,
                }
            );

            self.game_modes.write(
                TIME_BLITZ_MODE,
                GameMode {
                    id: TIME_BLITZ_MODE,
                    name: 'Time Blitz',
                    description: 'Time-limited puzzles',
                    is_timed: true,
                    time_limit: 60,
                    has_levels: false,
                    is_daily: false,
                    aids_allowed: AidsAllowed {
                        audience_poll: true,
                        call_friend: true,
                        fifty_fifty: true,
                    },
                    base_reward: 400,
                    time_bonus: 0,
                    time_bonus_multiplier: 1,
                    consecutive_bonus: 60,
                }
            );

            self.game_modes.write(
                PUZZLE_MODE,
                GameMode {
                    id: PUZZLE_MODE,
                    name: 'Puzzle',
                    description: 'Puzzle mode',
                    is_timed: false,
                    time_limit: 0,
                    has_levels: true,
                    is_daily: false,
                    aids_allowed: AidsAllowed {
                        audience_poll: false,
                        call_friend: false,
                        fifty_fifty: false,
                    },
                    base_reward: 500,
                    time_bonus: 0,
                    time_bonus_multiplier: 1,
                    consecutive_bonus: 70,
                }
            );

            self.game_modes.write(
                PRACTICE_MODE,
                GameMode {
                    id: PRACTICE_MODE,
                    name: 'Practice',
                    description: 'Practice mode',
                    is_timed: false,
                    time_limit: 0,
                    has_levels: true,
                    is_daily: false,
                    aids_allowed: AidsAllowed {
                        audience_poll: false,
                        call_friend: false,
                        fifty_fifty: false,
                    },
                    base_reward: 700,
                    time_bonus: 0,
                    time_bonus_multiplier: 1,
                    consecutive_bonus: 90,
                }
            );

            self.game_modes.write(
                ADVENTURE_MODE,
                GameMode {
                    id: ADVENTURE_MODE,
                    name: 'Adventure',
                    description: 'Adventure mode',
                    is_timed: false,
                    time_limit: 0,
                    has_levels: true,
                    is_daily: false,
                    aids_allowed: AidsAllowed {
                        audience_poll: false,
                        call_friend: false,
                        fifty_fifty: false,
                    },
                    base_reward: 800,
                    time_bonus: 0,
                    time_bonus_multiplier: 1,
                    consecutive_bonus: 100,
                }
            );

            self.game_modes.write(
                ENDLESS_MODE,
                GameMode {
                    id: ENDLESS_MODE,
                    name: 'Endless',
                    description: 'Endless mode',
                    is_timed: false,
                    time_limit: 0,
                    has_levels: true,
                    is_daily: false,
                    aids_allowed: AidsAllowed {
                        audience_poll: false,
                        call_friend: false,
                        fifty_fifty: false,
                    },
                    base_reward: 1000,
                    time_bonus: 0,
                    time_bonus_multiplier: 1,
                    consecutive_bonus: 120,
                }
            );

            self.initialize.write(true);
        }

        fn get_game_modes(self: @ContractState, mode_id: u8) -> GameMode {
            // Ensure mode_id is valid
            assert(mode_id <= ENDLESS_MODE, 'Invalid game mode ID');
            
            self.game_modes.read(mode_id)
        }
        
        // Update a player's progress in a specific game mode
        fn update_player_progress(
            ref self: ContractState, 
            player: ContractAddress, 
            mode_id: u8, 
            session_level: u32, 
            day: u32, 
            aids_used: AidsUsed, 
            rewards_earned: u256
        ) {
            // Ensure mode_id is valid
            assert(mode_id <= ENDLESS_MODE, 'Invalid game mode ID');
            
            // Only allow the player or an authorized address to update progress
            let caller = get_caller_address();
            assert(caller == player, 'Unauthorized');
            
            // Update player progress
            let progress = PlayerProgress {
                mode_id,
                session_level,
                day,
                aids_used,
                total_rewards: rewards_earned,
            };
            self.player_progress.write((player, mode_id), progress);
            
            // Update total rewards
            let current_rewards = self.player_total_rewards.read(player);
            self.player_total_rewards.write(player, current_rewards + rewards_earned);
        }
        
        // Get the total rewards earned by a player
        fn get_player_rewards(self: @ContractState, player: ContractAddress) -> u256 {
            self.player_total_rewards.read(player)
        }
     
     }

}
    