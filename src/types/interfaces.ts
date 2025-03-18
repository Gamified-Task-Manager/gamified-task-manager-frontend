export interface Task {
  id?: number; 
  name: string;
  description?: string;
  status: 'pending' | 'inProgress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  notes?: string;
  attachmentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
