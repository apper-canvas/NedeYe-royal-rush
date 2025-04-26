import React from 'react';
import { useSelector } from 'react-redux';

const LudoBoard = () => {
  const { players } = useSelector(state => state.game);
  
  // Create a visual representation of tokens on the board
  const renderBoardPosition = (position) => {
    const tokensOnPosition = [];
    
    // Find tokens on this position
    players.forEach(player => {
      player.tokens.forEach(token => {
        if (!token.inHome && !token.completed && token.position === position) {
          tokensOnPosition.push({ playerId: player.id, tokenId: token.id });
        }
      });
    });
    
    // Determine if this is a safe spot
    const safeSpots = [0, 8, 13, 21, 26, 34, 39, 47];
    const isSafeSpot = safeSpots.includes(position);
    
    // Determine cell background
    let cellClass = "w-8 h-8 flex items-center justify-center border border-gray-300 ";
    
    if (isSafeSpot) {
      cellClass += "bg-gray-200 ";
    } else {
      cellClass += "bg-white ";
    }
    
    // Special styling for home entrances
    if ([0, 13, 26, 39].includes(position)) {
      let entranceColor = "";
      if (position === 0) entranceColor = "border-l-4 border-l-red-500";
      if (position === 13) entranceColor = "border-t-4 border-t-green-500";
      if (position === 26) entranceColor = "border-r-4 border-r-yellow-500";
      if (position === 39) entranceColor = "border-b-4 border-b-blue-500";
      cellClass += entranceColor;
    }
    
    return (
      <div key={position} className={cellClass}>
        {tokensOnPosition.length > 0 ? (
          <div className="relative flex items-center justify-center w-full h-full">
            {tokensOnPosition.map((token, index) => {
              let tokenColor = "";
              switch (token.playerId) {
                case 0: tokenColor = "bg-red-500"; break;
                case 1: tokenColor = "bg-green-500"; break;
                case 2: tokenColor = "bg-yellow-500"; break;
                case 3: tokenColor = "bg-blue-500"; break;
                default: tokenColor = "bg-gray-500";
              }
              
              // Position tokens so they don't completely overlap
              const offset = index * 2;
              const style = { 
                top: `${50 - offset}%`, 
                left: `${50 - offset}%`,
                zIndex: index + 1
              };
              
              return (
                <div 
                  key={`${token.playerId}-${token.tokenId}`}
                  className={`w-5 h-5 rounded-full absolute ${tokenColor}`}
                  style={style}
                ></div>
              );
            })}
          </div>
        ) : (
          <span className="text-xs text-gray-400">{position}</span>
        )}
      </div>
    );
  };
  
  // Render the home paths for each player
  const renderHomePath = (playerId) => {
    const cellsForPath = 6;
    const cells = [];
    
    // Find tokens in home stretch
    const tokensInHomeStretch = players[playerId].tokens.filter(
      token => token.position >= 100 && token.position <= 106
    );
    
    for (let i = 1; i <= cellsForPath; i++) {
      const position = 100 + i;
      const tokensOnPosition = tokensInHomeStretch.filter(
        token => token.position === position
      );
      
      let cellColor = "";
      switch (playerId) {
        case 0: cellColor = "bg-red-200"; break;
        case 1: cellColor = "bg-green-200"; break;
        case 2: cellColor = "bg-yellow-200"; break;
        case 3: cellColor = "bg-blue-200"; break;
        default: cellColor = "bg-gray-200";
      }
      
      cells.push(
        <div key={`home-${playerId}-${i}`} className={`w-8 h-8 flex items-center justify-center border border-gray-300 ${cellColor}`}>
          {tokensOnPosition.length > 0 ? (
            <div className="relative flex items-center justify-center w-full h-full">
              {tokensOnPosition.map((token, index) => {
                let tokenColor = "";
                switch (playerId) {
                  case 0: tokenColor = "bg-red-500"; break;
                  case 1: tokenColor = "bg-green-500"; break;
                  case 2: tokenColor = "bg-yellow-500"; break;
                  case 3: tokenColor = "bg-blue-500"; break;
                  default: tokenColor = "bg-gray-500";
                }
                
                const offset = index * 2;
                const style = { 
                  top: `${50 - offset}%`, 
                  left: `${50 - offset}%`,
                  zIndex: index + 1
                };
                
                return (
                  <div 
                    key={`home-token-${token.id}`}
                    className={`w-5 h-5 rounded-full absolute ${tokenColor}`}
                    style={style}
                  ></div>
                );
              })}
            </div>
          ) : i === 6 ? (
            <div className="w-6 h-6 rounded-full border-2 border-gray-400 flex items-center justify-center">
              <span className="text-xs">🏠</span>
            </div>
          ) : null}
        </div>
      );
    }
    
    return cells;
  };
  
  // Create rows for the board
  const renderBoard = () => {
    const boardRows = [];
    
    // Top row (positions 10-16)
    boardRows.push(
      <div key="row-top" className="flex justify-center">
        {[10, 11, 12, 13, 14, 15, 16].map(pos => renderBoardPosition(pos))}
      </div>
    );
    
    // Middle section (left and right sides + home paths)
    for (let row = 0; row < 7; row++) {
      // For middle rows, we have left position, home paths, and right position
      const leftPos = row === 0 ? 9 : (row === 6 ? 51 : 9 - row);
      const rightPos = row === 0 ? 17 : (row === 6 ? 25 : 17 + row);
      
      boardRows.push(
        <div key={`row-${row}`} className="flex justify-center">
          {renderBoardPosition(leftPos)}
          
          {/* Render green home path (top) */}
          {row === 1 && (
            <div className="flex">
              {renderHomePath(1)}
            </div>
          )}
          
          {/* Center empty space or home paths */}
          {row !== 1 && row !== 5 && (
            <div className="flex">
              {Array(5).fill(0).map((_, i) => (
                <div key={`empty-${row}-${i}`} className="w-8 h-8"></div>
              ))}
            </div>
          )}
          
          {/* Render blue home path (bottom) */}
          {row === 5 && (
            <div className="flex">
              {renderHomePath(3)}
            </div>
          )}
          
          {renderBoardPosition(rightPos)}
        </div>
      );
    }
    
    // Bottom row (positions 42-48)
    boardRows.push(
      <div key="row-bottom" className="flex justify-center">
        {[48, 47, 46, 45, 44, 43, 42].map(pos => renderBoardPosition(pos))}
      </div>
    );
    
    // Added side home paths for Red (left) and Yellow (right)
    const sideHomePaths = (
      <div key="side-home-paths" className="flex justify-center">
        <div className="flex flex-col">
          {renderHomePath(0)}
        </div>
        
        <div className="flex">
          {Array(5).fill(0).map((_, i) => (
            <div key={`empty-side-${i}`} className="w-8 h-8"></div>
          ))}
        </div>
        
        <div className="flex flex-col">
          {renderHomePath(2)}
        </div>
      </div>
    );
    
    return (
      <div className="flex flex-col items-center">
        {boardRows}
        {sideHomePaths}
      </div>
    );
  };
  
  return (
    <div className="ludo-board bg-white p-4 rounded-lg shadow-lg">
      {renderBoard()}
    </div>
  );
};

export default LudoBoard;