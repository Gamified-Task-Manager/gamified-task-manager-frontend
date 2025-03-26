// src/hooks/useTaskSounds.ts

const useTaskSounds = () => {
  const playSound = (path: string, volume = 0.5) => {
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play().catch((err) => {
      console.error(`Sound failed to play: ${path}`, err);
    });
  };

  return {
    playPopSound: () => playSound('/sounds/pop.wav', 0.3),
    playAddSound: () => playSound('/sounds/pop.wav', 0.5),
    playSwooshSound: () => playSound('/sounds/swoosh-low.mp3', 0.5),
    playSlotSound: () => playSound('/sounds/coin.mp3', 0.6),
  };
};

export default useTaskSounds;
