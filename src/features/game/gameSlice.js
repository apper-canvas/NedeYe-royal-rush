import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  diceValue: 1,
  isRolling: false,
  currentPlayer: 0, // 0-3 for four players
  players: [
    { id: 0, name: 'Player 1', color: 'red', position: 0 },
    { id: 1, name: 'Player 2', color: 'green', position: 0 },
    { id: 2, name: 'Player 3', color: 'yellow', position: 0 },
    { id: 3, name: 'Player 4', color: 'blue', position: 0 }
  ],
  gameStarted: false,
  gameOver: false,
  winner: null
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    rollDice: (state, action) => {
      state.diceValue = action.payload;
      // Here you would update player position based on the dice value
      // For now, we're just rolling the dice
      
      // Move to next player's turn
      state.currentPlayer = (state.currentPlayer + 1) % 4;
    },
    setIsRolling: (state, action) => {
      state.isRolling = action.payload;
    },
    startGame: (state) => {
      state.gameStarted = true;
      state.gameOver = false;
      state.winner = null;
      state.currentPlayer = 0;
      state.players.forEach(player => {
        player.position = 0;
      });
    },
    resetGame: (state) => {
      return initialState;
    }
  }
});

export const { rollDice, setIsRolling, startGame, resetGame } = gameSlice.actions;

export default gameSlice.reducer;