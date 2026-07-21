export type TaskStatus =
  | 'todo'
  | 'in-progress'
  | 'review'
  | 'completed';

export type TaskPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type RequestStatus =
  | 'idle'
  | 'loading'
  | 'succeeded'
  | 'failed';

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedEmployeeIds: string[];
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedEmployeeIds: string[];
  dueDate: string;
}

export interface UpdateTaskInput {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedEmployeeIds: string[];
  dueDate: string;
}

export interface UpdateTaskStatusInput {
  taskId: string;
  status: TaskStatus;
}