import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoins } from '@fortawesome/free-solid-svg-icons';

interface FloatingCoinProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  onComplete: () => void;
}

const FloatingCoin = ({ from, to, onComplete }: FloatingCoinProps) => {
  const progress = useMotionValue(0);

  // Controls animation progress
  useEffect(() => {
    const controls = animate(progress, 1, {
      duration: 2.5,            // Faster, more energetic pace
      ease: "easeInOut",        // Smooth in-out easing
      onComplete: onComplete,   // Callback after animation ends
    });

    return () => controls.stop();
  }, [progress, onComplete]);

  // Arc path calculation (parabola for smooth arc)
  const x = useTransform(progress, [0, 1], [from.x, to.x]);
  const y = useTransform(progress, [0, 0.5, 1], [from.y, from.y - 150, to.y]); // rises up 150px mid-way, creating an arc
  const scale = useTransform(progress, [0, 0.5, 1], [1, 1.8, 1.2]); // Scale up and down for effect
  const opacity = useTransform(progress, [0.8, 1], [1, 0]); // Fade out at the very end
  const rotate = useTransform(progress, [0, 1], [0, 720]); // Double rotation for extra fun

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        x,
        y,
        scale,
        opacity,
        rotate,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <FontAwesomeIcon
        icon={faCoins}
        className="text-yellow-400 text-5xl drop-shadow-lg"
      />
    </motion.div>
  );
};

export default FloatingCoin;
