import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GameBoard from './components/GameBoard';

function App() {
  return (
    <Router>
      <div className="app min-h-screen py-8">
        <div className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<GameBoard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;