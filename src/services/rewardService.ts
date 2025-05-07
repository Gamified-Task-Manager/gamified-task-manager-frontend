import apiClient from './apiClient'

export const getAllRewards = () => {
  return apiClient.get('/api/v1/rewards')
}

export const getUserRewards = () => {
  return apiClient.get('/api/v1/user_rewards')
}
