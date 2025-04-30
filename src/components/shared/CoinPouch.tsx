import { motion, useAnimation } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { useEffect } from 'react';

interface CoinPouchProps {
  totalCoins: number;
}

const CoinPouch = ({ totalCoins }: CoinPouchProps) => {
  const navigate = useNavigate();
  const controls = useAnimation();

  const handleClick = () => navigate('/rewards');

  useEffect(() => {
    controls.start({
      scale: [1, 1.3, 0.9, 1.1, 1], // Bounce effect
      transition: {
        duration: 2.5, // Smooth and noticeable animation
        ease: 'easeInOut',
      },
    });
  }, [totalCoins, controls]);

  return (
    <motion.div
      onClick={handleClick}
      animate={controls}
      className="flex items-center gap-2 cursor-pointer bg-yellow-100 px-4 py-2 rounded-xl shadow-md hover:bg-white transition"
    >
      <FontAwesomeIcon
        icon={faSackDollar}
        className="text-yellow-500 text-4xl"
      />
      <span className="font-semibold text-xl text-neutral-700">
        <CountUp end={totalCoins} duration={2.5} />
      </span>
    </motion.div>
  );
};

export default CoinPouch;
