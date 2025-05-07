export interface Task {
  id?: number;
  name: string;
  description?: string;
  completed?: boolean;
  status: 'pending' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  points_awarded?: number;
  due_date?: string;
  notes?: string;
  attachment_url?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: number;
}

interface User {
  email: string;
  username: string;
  token: string;
  points: number; 
}

// src/types/interfaces.ts

// Generic API Response shape for JSON:API
export interface JsonApiResource<T> {
  id: string | number
  type: string
  attributes: T
}

// Raw attributes of a Reward
export interface RewardAttributes {
  name: string
  description: string
  points_required: number
  reward_type: 'game' | 'theme' | 'avatar'
  image_url?: string
  active: boolean
  created_at?: string
  updated_at?: string
}

// Full Reward object from backend
export type Reward = JsonApiResource<RewardAttributes>

// Raw attributes of a UserReward
export interface UserRewardAttributes {
  purchased: boolean
  unlocked: boolean
  created_at?: string
  updated_at?: string
}

// Full UserReward object from backend
export type UserReward = JsonApiResource<UserRewardAttributes> & {
  relationships?: {
    reward?: { data: { id: string; type: 'reward' } }
  }
}
