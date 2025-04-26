import Dice from './Dice';

const GameBoard = () => {
  return (
    <div className="game-board bg-green-100 p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-800">Ludo Master</h1>
      
      <div className="flex justify-center mb-8">
        <Dice />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-red-200 rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold text-red-800">Player 1</h2>
          <p>Position: Start</p>
        </div>
        <div className="bg-green-200 rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold text-green-800">Player 2</h2>
          <p>Position: Start</p>
        </div>
        <div className="bg-yellow-200 rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold text-yellow-800">Player 3</h2>
          <p>Position: Start</p>
        </div>
        <div className="bg-blue-200 rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold text-blue-800">Player 4</h2>
          <p>Position: Start</p>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2">Game Instructions:</h3>
        <ul className="list-disc pl-5">
          <li>Roll the dice to move your player</li>
          <li>Get a 6 to start moving your token</li>
          <li>First player to complete the circuit wins</li>
          <li>Land on an opponent to send them back to start</li>
        </ul>
      </div>
    </div>
  );
};

export default GameBoard;