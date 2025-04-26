import { createSlice } from '@reduxjs/toolkit';

// Constants for the game
const BOARD_SIZE = 52; // Total spaces on the board
const HOME_ENTRANCE = { 
  0: 0, // Red player home entrance at position 0
  1: 13, // Green player home entrance at position 13
  2: 26, // Yellow player home entrance at position 26
  3: 39 // Blue player home entrance at position 39
};

const initialState = {
  diceValue: 1,
  isRolling: false,
  currentPlayer: 0, // 0-3 for four players
  players: [
    { 
      id: 0, 
      name: 'Player 1', 
      color: 'red', 
      tokens: [
        { id: 0, position: -1, inHome: true, completed: false },
        { id: 1, position: -1, inHome: true, completed: false },
        { id: 2, position: -1, inHome: true, completed: false },
        { id: 3, position: -1, inHome: true, completed: false }
      ],
      startPosition: 0
    },
    { 
      id: 1, 
      name: 'Player 2', 
      color: 'green', 
      tokens: [
        { id: 0, position: -1, inHome: true, completed: false },
        { id: 1, position: -1, inHome: true, completed: false },
        { id: 2, position: -1, inHome: true, completed: false },
        { id: 3, position: -1, inHome: true, completed: false }
      ],
      startPosition: 13
    },
    { 
      id: 2, 
      name: 'Player 3', 
      color: 'yellow', 
      tokens: [
        { id: 0, position: -1, inHome: true, completed: false },
        { id: 1, position: -1, inHome: true, completed: false },
        { id: 2, position: -1, inHome: true, completed: false },
        { id: 3, position: -1, inHome: true, completed: false }
      ],
      startPosition: 26
    },
    { 
      id: 3, 
      name: 'Player 4', 
      color: 'blue', 
      tokens: [
        { id: 0, position: -1, inHome: true, completed: false },
        { id: 1, position: -1, inHome: true, completed: false },
        { id: 2, position: -1, inHome: true, completed: false },
        { id: 3, position: -1, inHome: true, completed: false }
      ],
      startPosition: 39
    }
  ],
  gameStarted: false,
  activeToken: null,
  gameOver: false,
  winner: null,
  message: "Roll the dice to start the game!",
  lastRoll: null,
  canRollAgain: false
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    rollDice: (state, action) => {
      state.diceValue = action.payload;
      state.lastRoll = action.payload;
      
      // Check if the current player has any valid moves
      const currentPlayer = state.players[state.currentPlayer];
      const hasValidMove = checkValidMoves(currentPlayer, action.payload);
      
      if (action.payload === 6) {
        state.canRollAgain = true;
        state.message = `${currentPlayer.name} rolled a 6! Select a token to move or roll again.`;
      } else {
        state.canRollAgain = false;
        
        if (!hasValidMove) {
          state.message = `${currentPlayer.name} rolled a ${action.payload}, but has no valid moves. Turn passed.`;
          state.currentPlayer = (state.currentPlayer + 1) % 4;
        } else {
          state.message = `${currentPlayer.name} rolled a ${action.payload}. Select a token to move.`;
        }
      }
      
      state.gameStarted = true;
    },
    
    setIsRolling: (state, action) => {
      state.isRolling = action.payload;
    },
    
    moveToken: (state, action) => {
      const { playerIndex, tokenIndex } = action.payload;
      const player = state.players[playerIndex];
      const token = player.tokens[tokenIndex];
      const diceValue = state.diceValue;
      
      // If token is in home and player rolls 6, move it out
      if (token.inHome && diceValue === 6) {
        token.inHome = false;
        token.position = player.startPosition;
        state.message = `${player.name} moved a token out of home!`;
        
        // Check for captures
        captureTokens(state, playerIndex, player.startPosition);
      } 
      // If token is already on the board, move it
      else if (!token.inHome && !token.completed) {
        // Calculate new position
        let newPosition = (token.position + diceValue) % BOARD_SIZE;
        
        // Check if token is entering home stretch
        if (isEnteringHomeStretch(player.id, token.position, newPosition)) {
          // Handle token movement in home stretch
          const homeProgress = calculateHomeProgress(player.id, token.position, diceValue);
          
          if (homeProgress <= 6) { // Valid move within home stretch
            token.position = 100 + homeProgress; // Use 100+ values for home stretch
            
            if (homeProgress === 6) { // Token reached the end
              token.completed = true;
              state.message = `${player.name} completed a token!`;
              
              // Check if all tokens are completed
              if (player.tokens.every(t => t.completed)) {
                state.winner = player.id;
                state.gameOver = true;
                state.message = `${player.name} has won the game!`;
              }
            } else {
              state.message = `${player.name} moved a token in the home stretch!`;
            }
          } else {
            // Invalid move, can't move beyond end position
            state.message = `${player.name} cannot move this token. Choose another or pass.`;
            return;
          }
        } else {
          // Regular move on the main board
          token.position = newPosition;
          state.message = `${player.name} moved a token!`;
          
          // Check for captures
          captureTokens(state, playerIndex, newPosition);
        }
      }
      
      // If player rolled a 6 and still has valid moves, they can roll again
      // Otherwise move to next player
      if (diceValue === 6 && state.canRollAgain) {
        state.message += " Roll again!";
      } else {
        state.currentPlayer = (state.currentPlayer + 1) % 4;
        state.canRollAgain = false;
      }
    },
    
    startGame: (state) => {
      return { ...initialState, gameStarted: true };
    },
    
    resetGame: () => {
      return initialState;
    }
  }
});

// Helper functions
function checkValidMoves(player, diceValue) {
  // Check if player can move any token
  return player.tokens.some(token => {
    // Can move out of home with a 6
    if (token.inHome && diceValue === 6) return true;
    
    // Can move if already on board and not completed
    if (!token.inHome && !token.completed) {
      // Check if in home stretch
      if (token.position >= 100) {
        // Check if valid move within home stretch
        const homeProgress = token.position - 100;
        return homeProgress + diceValue <= 6;
      }
      return true;
    }
    
    return false;
  });
}

function isEnteringHomeStretch(playerId, currentPos, newPos) {
  // Check if token passes or lands on its home entrance
  const homeEntrance = HOME_ENTRANCE[playerId];
  
  // Calculate if we're crossing the home entrance
  if (currentPos < homeEntrance && newPos >= homeEntrance) {
    return true;
  }
  
  // Special case for red player due to board wrapping
  if (playerId === 0 && currentPos > 39 && newPos < 13) {
    return true;
  }
  
  return false;
}

function calculateHomeProgress(playerId, currentPos, diceValue) {
  // Calculate progress in home stretch (1-6)
  if (currentPos >= 100) {
    // Already in home stretch
    return (currentPos - 100) + diceValue;
  }
  
  // Calculate distance from home entrance
  const homeEntrance = HOME_ENTRANCE[playerId];
  const distance = (currentPos <= homeEntrance) 
    ? homeEntrance - currentPos 
    : BOARD_SIZE - (currentPos - homeEntrance);
  
  // Return how far into home path the token will be
  return diceValue - distance;
}

function captureTokens(state, playerIndex, position) {
  // Check if any opponent tokens are at this position
  for (let i = 0; i < state.players.length; i++) {
    if (i !== playerIndex) { // Skip current player
      for (let j = 0; j < state.players[i].tokens.length; j++) {
        const token = state.players[i].tokens[j];
        
        // Check if token is on the same position and not in a safe spot
        if (!token.inHome && !token.completed && token.position === position && !isSafeSpot(position)) {
          // Send token back to home
          token.inHome = true;
          token.position = -1;
          state.message += ` ${state.players[i].name}'s token was captured!`;
        }
      }
    }
  }
}

function isSafeSpot(position) {
  // Safe spots are typically: home positions, star positions
  const safeSpots = [0, 8, 13, 21, 26, 34, 39, 47];
  return safeSpots.includes(position);
}

export const { rollDice, setIsRolling, moveToken, startGame, resetGame } = gameSlice.actions;

export default gameSlice.reducer;