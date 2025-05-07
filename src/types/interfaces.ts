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
// types/interfaces.ts

// ─────────────────────────────────────
// User Interface
// ─────────────────────────────────────
export interface User {
  email: string;
  username: string;
  token: string;
  points: number;
}

// ─────────────────────────────────────
// Reward Interfaces
// ─────────────────────────────────────
export interface RewardAttributes {
  name: string;
  description: string;
  points_required: number;
  reward_type: 'game' | 'theme' | 'avatar';
  active: boolean;
  image_url?: string;
}

// JSON:API-style response for Reward
export interface RewardJsonApi {
  id: string;
  type: 'reward';
  attributes: RewardAttributes;
  relationships?: {
    [key: string]: any; // Optional for now, unless you know specific structure
  };
}

// ─────────────────────────────────────
// UserReward Interfaces
// ─────────────────────────────────────
export interface UserRewardAttributes {
  purchased: boolean;
  unlocked: boolean;
  created_at: string;
  updated_at: string;
}

// JSON:API-style response for UserReward
export interface UserRewardJsonApi {
  id: string;
  type: 'user_reward';
  attributes: UserRewardAttributes;
  relationships?: {
    user?: {
      data: { id: string; type: 'user' };
    };
    reward?: {
      data: { id: string; type: 'reward' };
    };
  };
}
