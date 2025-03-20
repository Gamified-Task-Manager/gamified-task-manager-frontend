export interface Task {
  id?: number;
  name: string;
  description?: string;
  completed?: boolean;
  status: 'pending' | 'inProgress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  points_awarded?: number;
  dueDate?: string;
  notes?: string;
  attachmentUrl?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: number;
}
