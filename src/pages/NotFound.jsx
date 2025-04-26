import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="relative">
            <div className="text-9xl font-bold opacity-10 text-primary">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl font-bold">Page Not Found</div>
            </div>
          </div>
        </div>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
          Oops! It seems like you've rolled the dice and landed on a square that doesn't exist. Let's get you back to the game.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Home size={18} />
              Back to Home
            </motion.button>
          </Link>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.history.back()}
            className="btn btn-outline flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ArrowLeft size={18} />
            Go Back
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;