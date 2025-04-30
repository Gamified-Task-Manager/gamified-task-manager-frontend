import useSound from 'use-sound';

const popSound = "/sounds/pop.wav";
const addSound = "/sounds/add.mp3";
const slotSound = "/sounds/coin.mp3";
const swooshSound = "/sounds/swoosh-low.mp3";

const useTaskSounds = (enabled: boolean = false) => {
  const [playPopSound] = useSound(popSound, { volume: 0.25, soundEnabled: enabled });
  const [playAddSound] = useSound(addSound, { volume: 0.25, soundEnabled: enabled });
  const [playSlotSound] = useSound(slotSound, { volume: 0.25, soundEnabled: enabled });
  const [playSwooshSound] = useSound(swooshSound, { volume: 0.25, soundEnabled: enabled });

  return {
    playPopSound,
    playAddSound,
    playSlotSound,
    playSwooshSound
  };
};

export default useTaskSounds;
