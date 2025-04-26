import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Dice = ({ onRoll, disabled = false }) => {
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  // Dice faces represented as dot positions
  const diceFaces = {
    1: [{ top: '50%', left: '50%' }],
    2: [
      { top: '25%', left: '25%' },
      { top: '75%', left: '75%' }
    ],
    3: [
      { top: '25%', left: '25%' },
      { top: '50%', left: '50%' },
      { top: '75%', left: '75%' }
    ],
    4: [
      { top: '25%', left: '25%' },
      { top: '25%', left: '75%' },
      { top: '75%', left: '25%' },
      { top: '75%', left: '75%' }
    ],
    5: [
      { top: '25%', left: '25%' },
      { top: '25%', left: '75%' },
      { top: '50%', left: '50%' },
      { top: '75%', left: '25%' },
      { top: '75%', left: '75%' }
    ],
    6: [
      { top: '25%', left: '25%' },
      { top: '25%', left: '75%' },
      { top: '50%', left: '25%' },
      { top: '50%', left: '75%' },
      { top: '75%', left: '25%' },
      { top: '75%', left: '75%' }
    ]
  };

  const rollDice = () => {
    if (disabled || isRolling) return;
    
    setIsRolling(true);
    
    // Simulate dice rolling with changing values
    let rollCount = 0;
    const maxRolls = 10; // Number of visual "rolls" before settling
    const rollInterval = setInterval(() => {
      const newValue = Math.floor(Math.random() * 6) + 1;
      setDiceValue(newValue);
      rollCount++;
      
      if (rollCount >= maxRolls) {
        clearInterval(rollInterval);
        setIsRolling(false);
        // Pass the final dice value to the parent component
        onRoll && onRoll(newValue);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="dice w-24 h-24 relative mx-auto mb-4 cursor-pointer"
        whileHover={!disabled && !isRolling ? { scale: 1.05 } : {}}
        whileTap={!disabled && !isRolling ? { scale: 0.95 } : {}}
        animate={isRolling ? { rotate: [0, 90, 180, 270, 360] } : {}}
        transition={isRolling ? { duration: 0.5, repeat: 2 } : {}}
        onClick={rollDice}
      >
        {/* Dice dots */}
        {diceFaces[diceValue].map((position, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 rounded-full bg-black"
            style={{
              top: position.top,
              left: position.left,
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </motion.div>
      
      <button
        className={`ludo-button ${
          disabled ? 'bg-gray-400 cursor-not-allowed' : 'ludo-button-blue'
        }`}
        onClick={rollDice}
        disabled={disabled || isRolling}
      >
        {isRolling ? 'Rolling...' : 'Roll Dice'}
      </button>
    </div>
  );
};

export default Dice;