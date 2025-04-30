import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';

interface FloatingCoinProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  onComplete: () => void;
}

const FloatingCoin = ({ from, to, onComplete }: FloatingCoinProps) => (
  <motion.div
    initial={{ top: from.y, left: from.x, opacity: 1 }}
    animate={{ top: to.y, left: to.x, opacity: 0.6, scale: 0.7 }}
    transition={{ duration: 1 }}
    className="fixed z-50 pointer-events-none"
    onAnimationComplete={onComplete}
  >
    <FontAwesomeIcon icon={faCoins} className="text-yellow-400 text-xl" />
  </motion.div>
);

export default FloatingCoin;
