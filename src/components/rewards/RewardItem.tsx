import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { RewardJsonApi } from '../../types/interfaces';
import { purchaseReward } from '../../services/rewardService';

interface Props {
  reward: RewardJsonApi;
  purchased: boolean;
  refreshRewards: () => void;
}

const RewardItem = ({ reward, purchased, refreshRewards }: Props) => {
  const { user, updateUser } = useAuth();
  const [isPurchased, setIsPurchased] = useState(purchased);
  const [isLoading, setIsLoading] = useState(false);

  // Keep purchased state in sync with parent
  useEffect(() => {
    setIsPurchased(purchased);
  }, [purchased]);

  const handlePurchase = async () => {
    if (!user || isPurchased || user.points < reward.attributes.points_required) return;

    try {
      setIsLoading(true);
      await purchaseReward(Number(reward.id));
      await updateUser();         // refresh user points
      await refreshRewards();     // refresh purchased status
    } catch (err) {
      console.error('❌ Purchase failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative rounded-xl p-4 border transition duration-300 shadow-md ${
        isPurchased
          ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
          : 'bg-white text-neutral-dark hover:shadow-lg'
      }`}
    >
      {/* "Purchased" Banner */}
      {isPurchased && (
        <div className="absolute top-2 right-2 bg-gold text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          🎉 Purchased
        </div>
      )}

      {/* Reward Info */}
      <h3 className="text-lg font-bold mb-1">{reward.attributes.name}</h3>
      <p className="text-sm mb-2">{reward.attributes.description}</p>
      <p className="text-sm font-medium">Cost: {reward.attributes.points_required} coins</p>

      {/*  Only show button if not purchased */}
      {!isPurchased && (
        <button
          onClick={handlePurchase}
          disabled={isLoading}
          className="mt-4 w-full bg-gold text-white py-2 px-4 rounded hover:bg-yellow-600 disabled:opacity-60 disabled:cursor-wait"
        >
          {isLoading ? 'Purchasing...' : 'Purchase'}
        </button>
      )}
    </div>
  );
};

export default RewardItem;
