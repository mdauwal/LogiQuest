import React from 'react';

interface Player {
  id: string;
  name: string;
  level: number;
  score: number;
  avatar: string;
  scoreAvatar: string;
}

interface LeaderboardProps {
  players: Player[];
  title?: string;
  className?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  players, 
  title = 'PLAYERS', 
  className = '' 
}) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className={`max-w-md mx-auto bg-gray-900 rounded-lg shadow-md overflow-hidden ${className}`}>
      {/* Header section with tight padding */}
      <div className="bg-gray-900 px-4 pt-3 pb-4 -mt-1 -mx-1">
        <h4 className="text-white uppercase underline text-left">{title}</h4>
      </div>
  
      <div className="divide-y-0 border border-gray-500">
        {sortedPlayers.map((player) => (
        <div key={player.id} className="p-4 hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-center">
          {/* Left side - Player with Avatar */}
            <div className="flex items-center gap-3 flex-1">
              <img 
                src={player.avatar} 
                alt={player.name}
                className="w-8 h-8 rounded-full object-cover border border-gray-200"
              />
            <p className="text-gray-500 font-medium">{player.name}</p>
            </div>
          
          {/* Center - Level */}
            <div className="flex-1 text-center">
              <span className="text-gray-500">Level {player.level}</span>
            </div>
          
            {/* Right side - Score and Score Avatar */}
            <div className="flex items-center gap-4 justify-end flex-1">
              <span className="text-gray-500">
                {player.score.toLocaleString()}
              </span>
              <img 
                src={player.scoreAvatar}
                alt="Score badge"
                className="w-6 h-6 object-contain"
              />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
  );
};

export default Leaderboard;
