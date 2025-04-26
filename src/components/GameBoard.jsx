import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startGame, resetGame } from '../features/game/gameSlice';
import Dice from './Dice';
import Player from './Player';
import LudoBoard from './LudoBoard';

const GameBoard = () => {
  const dispatch = useDispatch();
  const { 
    players, 
    currentPlayer, 
    gameStarted, 
    gameOver, 
    winner, 
    message 
  } = useSelector(state => state.game);

  useEffect(() => {
    // Initialize the game when component mounts
    if (!gameStarted) {
      dispatch(startGame());
    }
  }, [dispatch, gameStarted]);

  const handleNewGame = () => {
    dispatch(resetGame());
    dispatch(startGame());
  };

  return (
    <div className="game-board bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl shadow-lg max-w-6xl mx-auto">
      <div className="relative">
        <h1 className="text-4xl font-bold text-center mb-6 text-indigo-800 relative z-10">
          Ludo Master
        </h1>
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-yellow-300 px-4 py-2 rounded-full text-2xl font-bold text-yellow-800 transform -rotate-12 shadow-lg">
              {players[winner]?.name} Wins!
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md mb-8">
        <div className="text-center text-lg font-medium text-gray-700">
          {message}
        </div>
        {gameStarted && !gameOver && (
          <div className="text-center mt-2 bg-indigo-100 rounded-lg p-2 text-indigo-800 font-semibold">
            {players[currentPlayer]?.name}'s Turn
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2">
          <div className="flex justify-center mb-6">
            <LudoBoard />
          </div>
        </div>
        
        <div className="flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-md mb-4">
              <h3 className="text-xl font-semibold mb-4 text-center">Players</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
                {players.map(player => (
                  <Player key={player.id} player={player} />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <Dice />
          </div>
          
          {gameOver && (
            <button
              onClick={handleNewGame}
              className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-md"
            >
              New Game
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Game Instructions:</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Roll a 6 to move a token out of home</li>
          <li>Roll the dice and select a token to move</li>
          <li>Rolling a 6 gives you an extra turn</li>
          <li>Landing on an opponent sends their token back home</li>
          <li>First player to get all 4 tokens to the finish wins</li>
          <li>Safe spots (marked in gray) protect tokens from capture</li>
        </ul>
      </div>
    </div>
  );
};

export default GameBoard;