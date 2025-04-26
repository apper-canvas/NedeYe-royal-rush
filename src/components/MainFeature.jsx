import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Users, Bot, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

// Game board constants
const BOARD_SIZE = 11; // 11x11 grid
const PLAYER_COLORS = {
  red: "bg-game-red",
  blue: "bg-game-blue",
  green: "bg-game-green",
  yellow: "bg-game-yellow"
};

const diceIcons = [
  <Dice1 size={32} />,
  <Dice2 size={32} />,
  <Dice3 size={32} />,
  <Dice4 size={32} />,
  <Dice5 size={32} />,
  <Dice6 size={32} />
];

const MainFeature = ({ gameMode, onBack }) => {
  const [players, setPlayers] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [selectedColor, setSelectedColor] = useState("red");
  const [gameStarted, setGameStarted] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceValue, setDiceValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [gameStatus, setGameStatus] = useState("");
  const [tokens, setTokens] = useState({});
  const [selectedToken, setSelectedToken] = useState(null);
  const [validMoves, setValidMoves] = useState([]);

  // Initialize game with default players based on game mode
  useEffect(() => {
    if (gameMode === "singleplayer") {
      // Default setup for single player mode
      setPlayers([
        { id: 1, name: "", color: "red", type: "human", tokens: [] },
        { id: 2, name: "AI 1", color: "blue", type: "ai", tokens: [] },
        { id: 3, name: "AI 2", color: "green", type: "ai", tokens: [] },
        { id: 4, name: "AI 3", color: "yellow", type: "ai", tokens: [] }
      ]);
    } else {
      // Default setup for multiplayer
      setPlayers([
        { id: 1, name: "", color: "red", type: "human", tokens: [] },
        { id: 2, name: "", color: "blue", type: "human", tokens: [] }
      ]);
    }
  }, [gameMode]);

  // Initialize tokens for each player
  const initializeTokens = () => {
    const initialTokens = {};
    
    players.forEach(player => {
      initialTokens[player.id] = [
        { id: `${player.id}-1`, position: "home", steps: 0 },
        { id: `${player.id}-2`, position: "home", steps: 0 },
        { id: `${player.id}-3`, position: "home", steps: 0 },
        { id: `${player.id}-4`, position: "home", steps: 0 }
      ];
    });
    
    setTokens(initialTokens);
  };

  // Start the game
  const startGame = () => {
    if (playerName.trim() === "") {
      setGameStatus("Please enter your name to start");
      return;
    }
    
    // Update player name
    const updatedPlayers = [...players];
    updatedPlayers[0].name = playerName;
    setPlayers(updatedPlayers);
    
    // Initialize tokens
    initializeTokens();
    
    // Start game
    setGameStarted(true);
    setGameStatus(`${playerName}'s turn. Roll the dice!`);
  };

  // Roll the dice
  const rollDice = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setGameStatus("Rolling dice...");
    
    // Simulate dice roll animation
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    // Stop rolling after 1 second
    setTimeout(() => {
      clearInterval(rollInterval);
      const finalValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(finalValue);
      setIsRolling(false);
      
      // Check for valid moves
      checkValidMoves(finalValue);
      
      // If it's 6, player gets another turn
      if (finalValue === 6) {
        setGameStatus(`You rolled a 6! ${players[currentPlayer].name} gets another turn. Select a token to move.`);
      } else {
        setGameStatus(`${players[currentPlayer].name} rolled a ${finalValue}. Select a token to move.`);
      }
    }, 1000);
  };

  // Check valid moves for current player based on dice value
  const checkValidMoves = (value) => {
    const playerTokens = tokens[players[currentPlayer].id];
    const validTokenMoves = [];
    
    playerTokens.forEach(token => {
      // If token is at home and dice value is 6, it can move out
      if (token.position === "home" && value === 6) {
        validTokenMoves.push(token.id);
      }
      // If token is already on board, it can move
      else if (token.position !== "home" && token.position !== "complete") {
        validTokenMoves.push(token.id);
      }
    });
    
    setValidMoves(validTokenMoves);
    
    // If no valid moves, move to next player
    if (validTokenMoves.length === 0) {
      setTimeout(() => {
        nextPlayer(value !== 6);
      }, 1500);
    }
  };

  // Move to next player
  const nextPlayer = (shouldChange = true) => {
    if (!shouldChange) return;
    
    const nextPlayerIndex = (currentPlayer + 1) % players.length;
    setCurrentPlayer(nextPlayerIndex);
    setDiceValue(null);
    setValidMoves([]);
    setSelectedToken(null);
    setGameStatus(`${players[nextPlayerIndex].name}'s turn. Roll the dice!`);
    
    // If next player is AI, simulate their turn
    if (players[nextPlayerIndex].type === "ai") {
      setTimeout(() => {
        simulateAITurn(nextPlayerIndex);
      }, 1500);
    }
  };

  // Simulate AI turn
  const simulateAITurn = (playerIndex) => {
    // Roll dice
    setIsRolling(true);
    setGameStatus(`${players[playerIndex].name} is rolling...`);
    
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);
    
    setTimeout(() => {
      clearInterval(rollInterval);
      const aiDiceValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(aiDiceValue);
      setIsRolling(false);
      
      setGameStatus(`${players[playerIndex].name} rolled a ${aiDiceValue}`);
      
      // Simulate token movement
      setTimeout(() => {
        // Simple AI logic - just move the first valid token
        const playerTokens = tokens[players[playerIndex].id];
        let moved = false;
        
        // Try to move a token out of home if rolled 6
        if (aiDiceValue === 6) {
          const homeToken = playerTokens.find(t => t.position === "home");
          if (homeToken) {
            moveToken(homeToken.id, playerIndex);
            moved = true;
          }
        }
        
        // If couldn't move out of home or didn't roll 6, move an active token
        if (!moved) {
          const activeToken = playerTokens.find(t => t.position !== "home" && t.position !== "complete");
          if (activeToken) {
            moveToken(activeToken.id, playerIndex);
            moved = true;
          }
        }
        
        // Move to next player if couldn't move or if didn't roll 6
        setTimeout(() => {
          nextPlayer(aiDiceValue !== 6 || !moved);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Handle token selection and movement
  const handleTokenClick = (tokenId) => {
    if (!diceValue || isRolling) return;
    
    // Check if this token can be moved
    if (validMoves.includes(tokenId)) {
      moveToken(tokenId, currentPlayer);
      
      // Move to next player if didn't roll 6
      setTimeout(() => {
        nextPlayer(diceValue !== 6);
      }, 1000);
    }
  };

  // Move a token
  const moveToken = (tokenId, playerIndex) => {
    const updatedTokens = { ...tokens };
    const playerTokens = [...updatedTokens[players[playerIndex].id]];
    const tokenIndex = playerTokens.findIndex(t => t.id === tokenId);
    
    if (tokenIndex === -1) return;
    
    const token = playerTokens[tokenIndex];
    
    // If token is at home and dice is 6, move to start position
    if (token.position === "home" && diceValue === 6) {
      token.position = "board";
      token.steps = 0;
      setGameStatus(`${players[playerIndex].name} moved a token to the starting position!`);
    }
    // If token is on board, move it forward
    else if (token.position === "board") {
      token.steps += diceValue;
      
      // Check if token completed the circuit (simplified)
      if (token.steps >= 50) {
        token.position = "complete";
        setGameStatus(`${players[playerIndex].name} completed a token!`);
        
        // Check for win condition
        const completedTokens = playerTokens.filter(t => t.position === "complete").length;
        if (completedTokens === 4) {
          setGameStatus(`🎉 ${players[playerIndex].name} wins the game! 🎉`);
          // Game over logic would go here
        }
      } else {
        setGameStatus(`${players[playerIndex].name} moved a token ${diceValue} steps!`);
      }
    }
    
    playerTokens[tokenIndex] = token;
    updatedTokens[players[playerIndex].id] = playerTokens;
    setTokens(updatedTokens);
  };

  // Render game board (simplified version)
  const renderGameBoard = () => {
    return (
      <div className="relative w-full max-w-md mx-auto aspect-square bg-surface-100 dark:bg-surface-800 rounded-xl shadow-card overflow-hidden">
        {/* Center area */}
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
          <div className="text-xl font-bold">RoyalRush</div>
        </div>
        
        {/* Player home areas */}
        <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-game-red bg-opacity-20 dark:bg-opacity-30 border-2 border-game-red rounded-tl-xl"></div>
        <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-game-blue bg-opacity-20 dark:bg-opacity-30 border-2 border-game-blue rounded-tr-xl"></div>
        <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-game-green bg-opacity-20 dark:bg-opacity-30 border-2 border-game-green rounded-br-xl"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-game-yellow bg-opacity-20 dark:bg-opacity-30 border-2 border-game-yellow rounded-bl-xl"></div>
        
        {/* Render tokens */}
        {Object.keys(tokens).map(playerId => {
          const player = players.find(p => p.id === parseInt(playerId));
          return tokens[playerId].map((token, index) => {
            // Position tokens in their home areas or on the board
            let positionStyle = {};
            
            if (token.position === "home") {
              // Position in home area based on index
              const offsetX = index % 2 === 0 ? "25%" : "75%";
              const offsetY = index < 2 ? "25%" : "75%";
              
              switch (player.color) {
                case "red":
                  positionStyle = { top: offsetY, left: offsetX, transform: "translate(-50%, -50%)" };
                  break;
                case "blue":
                  positionStyle = { top: offsetY, right: offsetX, transform: "translate(50%, -50%)" };
                  break;
                case "green":
                  positionStyle = { bottom: offsetY, right: offsetX, transform: "translate(50%, 50%)" };
                  break;
                case "yellow":
                  positionStyle = { bottom: offsetY, left: offsetX, transform: "translate(-50%, 50%)" };
                  break;
              }
            } else if (token.position === "board") {
              // Simplified board positioning - just place tokens along the edges
              // In a real implementation, this would be more complex based on token.steps
              const step = token.steps % 40; // Simplified path around the board
              
              if (step < 10) {
                positionStyle = { top: "45%", left: `${5 + step * 9}%` };
              } else if (step < 20) {
                positionStyle = { top: `${5 + (step - 10) * 9}%`, right: "5%" };
              } else if (step < 30) {
                positionStyle = { bottom: "45%", right: `${5 + (step - 20) * 9}%` };
              } else {
                positionStyle = { bottom: `${5 + (step - 30) * 9}%`, left: "5%" };
              }
            } else if (token.position === "complete") {
              // Position in center area
              const offsetX = index % 2 === 0 ? "40%" : "60%";
              const offsetY = index < 2 ? "40%" : "60%";
              positionStyle = { top: offsetY, left: offsetX };
            }
            
            return (
              <motion.div
                key={token.id}
                className={`game-token ${PLAYER_COLORS[player.color]} ${validMoves.includes(token.id) ? "ring-2 ring-white animate-pulse" : ""}`}
                style={positionStyle}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                onClick={() => handleTokenClick(token.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                position="absolute"
              >
                {index + 1}
              </motion.div>
            );
          });
        })}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-800"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </motion.button>
        
        <h2 className="text-2xl font-bold ml-4 flex items-center gap-2">
          {gameMode === "multiplayer" ? (
            <>
              <Users size={24} className="text-primary" />
              Multiplayer Game
            </>
          ) : (
            <>
              <Bot size={24} className="text-secondary" />
              Single Player Game
            </>
          )}
        </h2>
      </div>

      {!gameStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-surface-100 dark:bg-surface-800 rounded-xl p-6 shadow-card"
        >
          <h3 className="text-xl font-bold mb-4">Game Setup</h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-700 bg-white dark:bg-surface-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Choose Your Color</label>
            <div className="flex gap-4">
              {Object.keys(PLAYER_COLORS).map(color => (
                <motion.div
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-10 h-10 rounded-full cursor-pointer ${PLAYER_COLORS[color]} ${selectedColor === color ? "ring-4 ring-surface-300 dark:ring-surface-600" : ""}`}
                  onClick={() => setSelectedColor(color)}
                />
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Players</label>
            <div className="space-y-2">
              {players.map((player, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-surface-200 dark:bg-surface-700 rounded-lg">
                  <div className={`w-6 h-6 rounded-full ${PLAYER_COLORS[player.color]}`}></div>
                  <div className="flex-1">
                    {index === 0 ? (
                      <span>You{playerName ? ` (${playerName})` : ""}</span>
                    ) : (
                      <span>{player.name || `Player ${index + 1}`}</span>
                    )}
                  </div>
                  <div className="text-sm text-surface-500 dark:text-surface-400">
                    {player.type === "human" ? "Human" : "AI"}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {gameStatus && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg">
              {gameStatus}
            </div>
          )}
          
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="btn btn-primary"
            >
              Start Game
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {renderGameBoard()}
          </div>
          
          <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-6 shadow-card">
            <h3 className="text-xl font-bold mb-4">Game Controls</h3>
            
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Current Turn</div>
              <div className="flex items-center gap-3 p-3 bg-surface-200 dark:bg-surface-700 rounded-lg">
                <div className={`w-6 h-6 rounded-full ${PLAYER_COLORS[players[currentPlayer]?.color]}`}></div>
                <div className="font-medium">{players[currentPlayer]?.name}</div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Dice</div>
              <motion.div
                className="game-dice mx-auto"
                animate={isRolling ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                onClick={currentPlayer === 0 && !isRolling && !diceValue ? rollDice : undefined}
              >
                {diceValue ? diceIcons[diceValue - 1] : "?"}
              </motion.div>
              
              {currentPlayer === 0 && !isRolling && !diceValue && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={rollDice}
                  className="btn btn-primary w-full mt-4"
                >
                  Roll Dice
                </motion.button>
              )}
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-medium mb-2">Game Status</div>
              <div className="p-3 bg-surface-200 dark:bg-surface-700 rounded-lg min-h-[60px]">
                {gameStatus}
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Players</div>
              <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-hide">
                {players.map((player, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center gap-3 p-3 rounded-lg ${currentPlayer === index ? "bg-surface-300 dark:bg-surface-600" : "bg-surface-200 dark:bg-surface-700"}`}
                  >
                    <div className={`w-6 h-6 rounded-full ${PLAYER_COLORS[player.color]}`}></div>
                    <div className="flex-1 font-medium">
                      {player.name || `Player ${index + 1}`}
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-surface-300 dark:bg-surface-600">
                      {tokens[player.id]?.filter(t => t.position === "complete").length || 0}/4
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainFeature;