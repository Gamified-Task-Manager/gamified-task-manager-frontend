import { purchaseReward } from '../../services/rewardService';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { RewardJsonApi } from '../../types/interfaces';

interface Props {
  reward: RewardJsonApi;
  purchased: boolean;
}

const RewardItem = ({ reward, purchased }: Props) => {
  const { user, updatePoints} = useAuth();
  const [isPurchased, setIsPurchased] = useState(purchased);
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!user || isPurchased || user.points < reward.attributes.points_required) return;
  
    try {
      setIsLoading(true);
      await purchaseReward(Number(reward.id));
      setIsPurchased(true);
      updatePoints(user.points - reward.attributes.points_required);
    } catch (err) {
      console.error('Purchase failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`rounded-lg p-4 border transition shadow ${
        isPurchased ? 'opacity-50' : 'hover:shadow-md'
      }`}
    >
      <h3 className="text-lg font-bold">{reward.attributes.name}</h3>
      <p className="text-sm text-neutral-grey">{reward.attributes.description}</p>
      <p className="text-sm mt-2">Cost: {reward.attributes.points_required} coins</p>

      {!isPurchased && (
        <button
          onClick={handlePurchase}
          disabled={isLoading || isPurchased}
          className="mt-3 bg-gold text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          {isLoading ? 'Purchasing...' : 'Purchase'}
        </button>
      )}
    </div>
  );
};

export default RewardItem;
