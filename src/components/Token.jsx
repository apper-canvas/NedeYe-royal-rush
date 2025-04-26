import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moveToken } from '../features/game/gameSlice';

const Token = ({ playerId, tokenId, position, inHome, completed }) => {
  const dispatch = useDispatch();
  const { currentPlayer, diceValue, gameOver, canRollAgain } = useSelector(state => state.game);
  
  const isCurrentPlayer = currentPlayer === playerId;
  
  // Determine if this token can be moved
  const canMove = () => {
    if (gameOver || !isCurrentPlayer) return false;
    
    // Can move out of home with a 6
    if (inHome && diceValue === 6) return true;
    
    // Can move if already on board and not completed
    if (!inHome && !completed) {
      // If in home stretch, check if valid move
      if (position >= 100) {
        const homeProgress = position - 100;
        return homeProgress + diceValue <= 6;
      }
      return true;
    }
    
    return false;
  };
  
  const handleTokenClick = () => {
    if (canMove()) {
      dispatch(moveToken({ playerIndex: playerId, tokenIndex: tokenId }));
    }
  };
  
  // Get token color
  const getTokenColor = () => {
    switch (playerId) {
      case 0: return 'bg-red-500 border-red-700';
      case 1: return 'bg-green-500 border-green-700';
      case 2: return 'bg-yellow-500 border-yellow-700';
      case 3: return 'bg-blue-500 border-blue-700';
      default: return 'bg-gray-500 border-gray-700';
    }
  };
  
  // Determine the token's rendering state
  let tokenClass = `w-6 h-6 rounded-full border-2 ${getTokenColor()}`;
  
  if (completed) {
    tokenClass += ' opacity-50';
  }
  
  if (canMove()) {
    tokenClass += ' cursor-pointer transform hover:scale-110 shadow-lg';
  } else {
    tokenClass += ' cursor-default';
  }
  
  if (isCurrentPlayer && !inHome && !completed && diceValue > 0) {
    tokenClass += ' ring-2 ring-white ring-offset-2';
  }
  
  return (
    <div 
      className={tokenClass}
      onClick={handleTokenClick}
      title={`${inHome ? 'In Home' : completed ? 'Completed' : `Position: ${position}`}`}
    />
  );
};

export default Token;