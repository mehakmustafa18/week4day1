export type Priority = 'low' | 'medium' | 'high';
export type Category = 'general' | 'work' | 'personal' | 'study';

export interface Task {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate: string;
  completed: boolean;
  createdAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  category?: Category;
  dueDate?: string;
}
