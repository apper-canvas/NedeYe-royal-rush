import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Bot } from 'lucide-react';
import Dice from './Dice';

const MainFeature = ({ gameMode, onBack }) => {
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [lastRoll, setLastRoll] = useState(null);
  const [players, setPlayers] = useState([]);
  const [message, setMessage] = useState('Roll the dice to start the game!');

  // Initialize players based on game mode
  useEffect(() => {
    if (gameMode === 'singleplayer') {
      setPlayers([
        { id: 0, name: 'You', color: 'red', position: 0, tokens: [0, 0, 0, 0] },
        { id: 1, name: 'AI 1', color: 'blue', position: 0, tokens: [0, 0, 0, 0] },
        { id: 2, name: 'AI 2', color: 'green', position: 0, tokens: [0, 0, 0, 0] },
        { id: 3, name: 'AI 3', color: 'yellow', position: 0, tokens: [0, 0, 0, 0] }
      ]);
    } else {
      setPlayers([
        { id: 0, name: 'Player 1', color: 'red', position: 0, tokens: [0, 0, 0, 0] },
        { id: 1, name: 'Player 2', color: 'blue', position: 0, tokens: [0, 0, 0, 0] },
        { id: 2, name: 'Player 3', color: 'green', position: 0, tokens: [0, 0, 0, 0] },
        { id: 3, name: 'Player 4', color: 'yellow', position: 0, tokens: [0, 0, 0, 0] }
      ]);
    }
  }, [gameMode]);

  // Handle dice roll
  const handleDiceRoll = (value) => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    setLastRoll(value);
    
    // Update game state based on dice roll
    const updatedPlayers = [...players];
    const player = updatedPlayers[currentPlayer];
    
    // Update message based on roll value
    if (value === 6) {
      setMessage(`${player.name} rolled a 6! You can move a token out or roll again.`);
      // In a real game, you would handle token movement here
      
      // For the demo, let's just update the first token position
      if (player.tokens[0] === 0) {
        player.tokens[0] = 1; // Move out of home
      } else {
        player.tokens[0] += value; // Move along the board
      }
    } else {
      setMessage(`${player.name} rolled a ${value}. Moving token...`);
      
      // Find a token that can move (not in home if value != 6)
      const moveableTokenIndex = player.tokens.findIndex(pos => pos > 0);
      if (moveableTokenIndex >= 0) {
        player.tokens[moveableTokenIndex] += value;
      }
      
      // Move to next player
      setCurrentPlayer((currentPlayer + 1) % players.length);
    }
    
    setPlayers(updatedPlayers);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="ludo-card relative"
    >
      <button
        onClick={onBack}
        className="absolute top-4 left-4 p-2 rounded-full bg-surface-200 hover:bg-surface-300 transition-colors"
      >
        <ArrowLeft size={20} />
      </button>
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {gameMode === 'singleplayer' ? 'Single Player Mode' : 'Multiplayer Mode'}
        </h2>
        <div className="flex items-center justify-center gap-2 text-surface-600">
          {gameMode === 'singleplayer' ? (
            <Bot size={18} />
          ) : (
            <Users size={18} />
          )}
          <span>
            {gameMode === 'singleplayer'
              ? 'Playing against AI'
              : 'Playing with friends'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-100 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">Game Board</h3>
          
          {/* Simplified board representation */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {players.map((player, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 text-center ${
                  currentPlayer === index ? 'border-4 border-black' : 'border-gray-200'
                }`}
                style={{ backgroundColor: `var(--ludo-${player.color})` }}
              >
                <p className="font-bold text-white">{player.name}</p>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {player.tokens.map((pos, tokenIndex) => (
                    <div 
                      key={tokenIndex}
                      className="w-6 h-6 rounded-full bg-white mx-auto"
                      title={`Position: ${pos}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mb-4">
            <p className="font-medium">{message}</p>
            {lastRoll && (
              <p className="text-lg font-bold mt-2">
                Last roll: <span className="text-primary">{lastRoll}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="text-center mb-6">
            <h3 className="font-bold text-xl mb-2">
              {players[currentPlayer]?.name}'s Turn
            </h3>
            <p className="text-surface-600">
              {gameMode === 'singleplayer' && currentPlayer > 0
                ? 'AI is thinking...'
                : 'Roll the dice to move'}
            </p>
          </div>
          
          <Dice 
            onRoll={handleDiceRoll}
            disabled={gameMode === 'singleplayer' && currentPlayer > 0}
          />
          
          {/* Player info */}
          <div className="mt-8">
            <h4 className="font-bold mb-2">Players</h4>
            <div className="space-y-2">
              {players.map((player, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2"
                >
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: `var(--ludo-${player.color})` }}
                  />
                  <span className={currentPlayer === index ? 'font-bold' : ''}>
                    {player.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MainFeature;