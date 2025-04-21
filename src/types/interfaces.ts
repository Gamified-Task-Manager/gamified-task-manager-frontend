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
