import React from 'react';
import Token from './Token';
import { useSelector } from 'react-redux';

const Player = ({ player }) => {
  const { currentPlayer } = useSelector(state => state.game);
  const isActive = currentPlayer === player.id;
  
  // Determine player area color based on player color
  const getPlayerAreaColor = () => {
    switch (player.color) {
      case 'red': return 'bg-red-100 border-red-500';
      case 'green': return 'bg-green-100 border-green-500';
      case 'yellow': return 'bg-yellow-100 border-yellow-500';
      case 'blue': return 'bg-blue-100 border-blue-500';
      default: return 'bg-gray-100 border-gray-500';
    }
  };
  
  return (
    <div 
      className={`p-4 rounded-lg ${getPlayerAreaColor()} ${
        isActive ? 'border-4 shadow-lg' : 'border-2'
      }`}
    >
      <h3 className="font-bold text-lg mb-2">{player.name}</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {player.tokens.map(token => (
          <div key={token.id} className="flex justify-center items-center p-1">
            <Token 
              playerId={player.id}
              tokenId={token.id}
              position={token.position}
              inHome={token.inHome}
              completed={token.completed}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-2 text-sm">
        {player.tokens.filter(t => t.completed).length} / 4 completed
      </div>
    </div>
  );
};

export default Player;