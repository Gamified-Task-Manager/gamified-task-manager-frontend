import apiClient from './apiClient'

export const getAllRewards = () => {
  return apiClient.get('/rewards')
}

export const getUserRewards = () => {
  return apiClient.get('/user_rewards')
}

export const purchaseReward = async (rewardId: number) => {
  const response = await apiClient.post('/user_rewards', {
    user_reward: { reward_id: rewardId },
  });
  return response.data;
};
