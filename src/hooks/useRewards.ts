import { useEffect, useState } from 'react'
import { getAllRewards, getUserRewards } from '../services/rewardService'
import { Reward, UserReward } from '../types/interfaces'

export const useRewards = () => {
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([])
  const [userRewards, setUserRewards] = useState<UserReward[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRewards = async () => {
    try {
      const rewardsRes = await getAllRewards()
      const userRewardsRes = await getUserRewards()

      setAvailableRewards(rewardsRes.data.data)
      setUserRewards(userRewardsRes.data.data)

      console.log('🎁 Available Rewards:', rewardsRes.data.data)
      console.log('🙋 User Rewards:', userRewardsRes.data.data)
    } catch (error) {
      console.error('Failed to fetch rewards:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRewards()
  }, [])

  return {
    availableRewards,
    userRewards,
    refreshRewards: fetchRewards,
    loading,
  }
}
