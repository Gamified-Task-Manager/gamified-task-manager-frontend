import { useRewards } from '../hooks/useRewards';
import { useAuth } from '../contexts/AuthContext';
import RewardItem from '../components/rewards/RewardItem';
import CoinPouch from '../components/shared/CoinPouch';
import { useEffect, useRef, useState } from 'react';

const Rewards = () => {
  const { availableRewards, userRewards, loading, refreshRewards } = useRewards(); // ✅ added refresh
  const { user } = useAuth();
  const pouchRef = useRef<HTMLDivElement>(null);
  const [totalCoins, setTotalCoins] = useState(user?.points || 0);

  useEffect(() => {
    if (user) setTotalCoins(user.points || 0);
  }, [user]);

  if (loading) return <div className="p-6 text-neutral-light">Loading rewards...</div>;

  const isPurchased = (rewardId: string | number) => {
    return userRewards.some((ur) => {
      const rewardRel = ur.relationships?.reward?.data?.id;
      const purchased = ur.attributes?.purchased;
      return rewardRel === rewardId.toString() && purchased;
    });
  };

  const renderSection = (type: string, title: string) => {
    const rewards = availableRewards.filter((r) => r.attributes.reward_type === type);

    return (
      <div className="mb-10">
        <h2 className="text-xl font-bold text-gold mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <RewardItem
              key={reward.id}
              reward={reward}
              purchased={isPurchased(reward.id)}
              onPurchaseSuccess={refreshRewards} // ✅ re-check purchased status
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative p-6 md:p-12 bg-neutral-light min-h-screen text-neutral-dark font-sans">
      <div ref={pouchRef} className="absolute top-6 right-6">
        <CoinPouch totalCoins={totalCoins} />
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-5xl font-serif text-gold mb-2">Rewards Store</h1>
        <p className="text-lg text-neutral-grey">Spend your Task Bucks on cool rewards!</p>
      </div>

      {renderSection('game', 'Games')}
      {renderSection('theme', 'Themes')}
      {renderSection('avatar', 'Avatars')}
    </div>
  );
};

export default Rewards;
