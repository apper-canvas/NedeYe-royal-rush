import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

function App() {
  return (
    <Router>
      <div className="ludo-container">
        <div className="ludo-content min-h-screen p-4 md:p-8">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-yellow-500 to-green-600">
              Ludo Master
            </h1>
            <p className="text-gray-700 text-lg">The Ultimate Board Game Experience</p>
          </header>
          
          <main className="max-w-6xl mx-auto">
            <Routes>
              <Route path="/" element={<GameBoard />} />
              {/* Add more routes as needed */}
            </Routes>
          </main>
          
          <footer className="mt-12 text-center text-gray-600">
            <p>© 2023 Ludo Master - The Classic Board Game</p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

function GameBoard() {
  return (
    <div className="ludo-card">
      <div className="flex flex-col items-center gap-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          <PlayerSection color="red" name="Player 1" />
          <PlayerSection color="blue" name="Player 2" />
          <PlayerSection color="green" name="Player 3" />
          <PlayerSection color="yellow" name="Player 4" />
        </div>
        
        <div className="dice-container">
          <div className="dice flex items-center justify-center text-4xl font-bold">
            6
          </div>
          <button className="ludo-button ludo-button-red mt-4">
            Roll Dice
          </button>
        </div>
        
        <div className="board-container w-full aspect-square max-w-2xl mx-auto bg-white rounded-lg shadow-lg border-2 border-gray-200">
          {/* Placeholder for the actual game board */}
          <div className="grid grid-cols-3 h-full">
            <div className="bg-red-100 border border-gray-200"></div>
            <div className="border border-gray-200"></div>
            <div className="bg-blue-100 border border-gray-200"></div>
            <div className="border border-gray-200"></div>
            <div className="border border-gray-200"></div>
            <div className="border border-gray-200"></div>
            <div className="bg-green-100 border border-gray-200"></div>
            <div className="border border-gray-200"></div>
            <div className="bg-yellow-100 border border-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerSection({ color, name }) {
  const colorMap = {
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500"
  };
  
  return (
    <div className="ludo-card">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-4 h-4 rounded-full ${colorMap[color]}`}></div>
        <h3 className="font-bold">{name}</h3>
      </div>
      <div className="flex gap-2">
        <div className={`w-6 h-6 rounded-full ${colorMap[color]} shadow-md`}></div>
        <div className={`w-6 h-6 rounded-full ${colorMap[color]} shadow-md`}></div>
        <div className={`w-6 h-6 rounded-full ${colorMap[color]} shadow-md`}></div>
        <div className={`w-6 h-6 rounded-full ${colorMap[color]} shadow-md`}></div>
      </div>
    </div>
  );
}

export default App;