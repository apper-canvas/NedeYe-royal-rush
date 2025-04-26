import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rollDice, setIsRolling } from '../features/game/gameSlice';

const Dice = () => {
  const dispatch = useDispatch();
  const { diceValue, isRolling, currentPlayer, gameOver, canRollAgain } = useSelector(state => state.game);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isRolling) {
      const interval = setInterval(() => {
        setRotation(prev => prev + 90);
      }, 100);

      // Stop rolling after a random time between 1-2 seconds
      const rollTime = 1000 + Math.random() * 1000;
      
      setTimeout(() => {
        clearInterval(interval);
        dispatch(setIsRolling(false));
      }, rollTime);

      return () => clearInterval(interval);
    }
  }, [isRolling, dispatch]);

  const handleRollDice = () => {
    if (!isRolling && !gameOver) {
      dispatch(setIsRolling(true));
      // Generate random dice value (1-6)
      const newValue = Math.floor(Math.random() * 6) + 1;
      
      // Wait for animation to complete before setting the value
      setTimeout(() => {
        dispatch(rollDice(newValue));
      }, 1000);
    }
  };

  const renderDiceFace = () => {
    switch (diceValue) {
      case 1:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-between h-full p-2">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full self-end"></div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col justify-between h-full p-2">
            <div className="w-3 h-3 bg-black rounded-full self-end"></div>
            <div className="w-3 h-3 bg-black rounded-full self-center"></div>
            <div className="w-3 h-3 bg-black rounded-full self-start"></div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 gap-2 p-2 h-full">
            <div className="w-3 h-3 bg-black rounded-full justify-self-start self-start"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-end self-start"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-start self-end"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-end self-end"></div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-2 gap-2 p-2 h-full">
            <div className="w-3 h-3 bg-black rounded-full justify-self-start self-start"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-end self-start"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-center self-center col-span-2"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-start self-end"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-end self-end"></div>
          </div>
        );
      case 6:
        return (
          <div className="grid grid-cols-2 gap-2 p-2 h-full">
            <div className="w-3 h-3 bg-black rounded-full justify-self-start self-start"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-end self-start"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-start self-center"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-end self-center"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-start self-end"></div>
            <div className="w-3 h-3 bg-black rounded-full justify-self-end self-end"></div>
          </div>
        );
      default:
        return null;
    }
  };

  // Check if the current player can roll
  const canRoll = !isRolling && !gameOver && (canRollAgain || true);

  return (
    <div className="flex flex-col items-center">
      <div 
        className={`dice w-20 h-20 bg-white border-2 border-gray-300 rounded-lg shadow-lg mb-4 ${isRolling ? 'animate-bounce' : ''}`}
        style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.1s ease-in-out' }}
      >
        {renderDiceFace()}
      </div>
      <button
        onClick={handleRollDice}
        disabled={!canRoll}
        className={`bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-md ${!canRoll ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRolling ? 'Rolling...' : gameOver ? 'Game Over' : 'Roll Dice'}
      </button>
      {!isRolling && diceValue > 0 && !gameOver && (
        <p className="mt-4 text-lg font-semibold">You rolled a {diceValue}!</p>
      )}
    </div>
  );
};

export default Dice;