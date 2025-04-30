import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBill1 } from '@fortawesome/free-solid-svg-icons';

interface FloatingCoinProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  onComplete: () => void;
}

const FloatingCoin = ({ from, to, onComplete }: FloatingCoinProps) => (
  <motion.div
    initial={{
      top: from.y,
      left: from.x,
      opacity: 1,
      scale: 1,
      rotate: 0,
    }}
    animate={{
      top: to.y,
      left: to.x,
      opacity: 0,
      scale: 1.2,
      rotate: 180,
    }}
    transition={{
      duration: 3,
      ease: 'easeInOut',
    }}
    className="fixed z-50 pointer-events-none"
    style={{ position: 'fixed' }}
    onAnimationComplete={onComplete}
  >
    <FontAwesomeIcon
      icon={faMoneyBill1}
      className="text-green-500 text-5xl drop-shadow-lg"
    />
  </motion.div>
);

export default FloatingCoin;
