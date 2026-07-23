import {
  mockEmployees,
  mockProjects,
  mockTasks,
} from '../data/mockData';

import type {
  CreateTaskInput,
  Employee,
  Project,
  Task,
} from '../types';

const NETWORK_DELAY = 900;

const wait = (
  milliseconds: number,
): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
};

const cloneData = <T>(data: T): T => {
  return structuredClone(data);
};

const generateId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `task-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
};

export const mockApi = {
  async getProjects(): Promise<Project[]> {
    await wait(NETWORK_DELAY);

    return cloneData(mockProjects);
  },

  async getEmployees(): Promise<Employee[]> {
    await wait(NETWORK_DELAY);

    return cloneData(mockEmployees);
  },

  async getTasks(): Promise<Task[]> {
    await wait(NETWORK_DELAY);

    return cloneData(mockTasks);
  },

  async createTask(
    input: CreateTaskInput,
  ): Promise<Task> {
    await wait(700);

    const now = new Date().toISOString();

    const newTask: Task = {
      id: generateId(),
      projectId: input.projectId,
      title: input.title.trim(),
      description: input.description.trim(),
      status: input.status,
      priority: input.priority,
      assignedEmployeeIds:
        input.assignedEmployeeIds,
      dueDate: input.dueDate,
      createdAt: now,
      updatedAt: now,
    };

    mockTasks.unshift(newTask);

    return cloneData(newTask);
  },

  async updateTaskStatus(
    taskId: string,
    status: Task['status'],
  ): Promise<Task> {
    await wait(600);

    const task = mockTasks.find(
      (item) => item.id === taskId,
    );

    if (!task) {
      throw new Error('Task not found.');
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();

    return cloneData(task);
  },

  async deleteTask(
    taskId: string,
  ): Promise<string> {
    await wait(500);

    const taskIndex = mockTasks.findIndex(
      (task) => task.id === taskId,
    );

    if (taskIndex === -1) {
      throw new Error('Task not found.');
    }

    mockTasks.splice(taskIndex, 1);

    return taskId;
  },
};