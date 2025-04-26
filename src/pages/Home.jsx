import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Bot, Trophy, Info } from "lucide-react";
import MainFeature from "../components/MainFeature";

const Home = () => {
  const [gameMode, setGameMode] = useState(null);
  const [showRules, setShowRules] = useState(false);

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Welcome to RoyalRush
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">
          Experience the classic Ludo game with a modern twist. Challenge friends or AI opponents in this strategic race to the finish!
        </p>
      </motion.div>

      {!gameMode ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-primary-light to-primary rounded-2xl p-6 text-white shadow-soft cursor-pointer"
            onClick={() => setGameMode("multiplayer")}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Users size={24} />
              </div>
              <h2 className="text-2xl font-bold">Multiplayer</h2>
            </div>
            <p className="mb-4">Challenge your friends in a real-time multiplayer match. Create a room and invite up to 3 other players.</p>
            <div className="flex justify-end">
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">2-4 Players</span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-br from-secondary-light to-secondary rounded-2xl p-6 text-white shadow-soft cursor-pointer"
            onClick={() => setGameMode("singleplayer")}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Bot size={24} />
              </div>
              <h2 className="text-2xl font-bold">Single Player</h2>
            </div>
            <p className="mb-4">Play against AI opponents with adjustable difficulty levels. Perfect for practice or quick games.</p>
            <div className="flex justify-end">
              <span className="text-sm bg-white/20 px-3 py-1 rounded-full">vs AI</span>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <MainFeature gameMode={gameMode} onBack={() => setGameMode(null)} />
      )}

      <div className="flex justify-center gap-4 mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-outline flex items-center gap-2"
          onClick={() => setShowRules(!showRules)}
        >
          <Info size={18} />
          {showRules ? "Hide Rules" : "Game Rules"}
        </motion.button>
        
        <motion.a
          href="#leaderboard"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn btn-outline flex items-center gap-2"
        >
          <Trophy size={18} />
          Leaderboard
        </motion.a>
      </div>

      {showRules && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-surface-100 dark:bg-surface-800 rounded-xl p-6 mb-8 shadow-card"
        >
          <h3 className="text-xl font-bold mb-4">How to Play RoyalRush</h3>
          <ul className="list-disc pl-5 space-y-2 text-surface-700 dark:text-surface-300">
            <li>Each player has 4 tokens that start in their home yard.</li>
            <li>Roll a 6 to move a token out of the home yard onto the starting square.</li>
            <li>Take turns rolling the dice and moving your tokens clockwise around the board.</li>
            <li>If you land on an opponent's token, it returns to their home yard.</li>
            <li>Roll a 6 to get an extra turn.</li>
            <li>To win, move all 4 of your tokens around the board and into the home triangle.</li>
          </ul>
        </motion.div>
      )}

      <div id="leaderboard" className="mt-12 bg-surface-100 dark:bg-surface-800 rounded-xl p-6 shadow-card">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy size={24} className="text-yellow-500" />
          Top Players
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-300 dark:border-surface-700">
                <th className="text-left py-3 px-4">Rank</th>
                <th className="text-left py-3 px-4">Player</th>
                <th className="text-left py-3 px-4">Wins</th>
                <th className="text-left py-3 px-4">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {[
                { rank: 1, name: "LudoMaster", wins: 342, rate: "68%" },
                { rank: 2, name: "TokenQueen", wins: 289, rate: "64%" },
                { rank: 3, name: "DiceKing", wins: 256, rate: "59%" },
                { rank: 4, name: "BoardWizard", wins: 201, rate: "55%" },
                { rank: 5, name: "GameChamp", wins: 187, rate: "52%" }
              ].map((player) => (
                <tr key={player.rank} className="border-b border-surface-200 dark:border-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
                  <td className="py-3 px-4 font-medium">{player.rank}</td>
                  <td className="py-3 px-4">{player.name}</td>
                  <td className="py-3 px-4">{player.wins}</td>
                  <td className="py-3 px-4">{player.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;