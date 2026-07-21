import {
  mockEmployees,
  mockProjects,
  mockTasks,
} from '../data/mockData';

import type {
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

  async updateTaskStatus(
    taskId: string,
    status: Task['status'],
  ): Promise<Task> {
    await wait(600);

    const task = mockTasks.find(
      (item) => item.id === taskId,
    );

    if (!task) {
      throw new Error('Task not found');
    }

    task.status = status;
    task.updatedAt = new Date().toISOString();

    return cloneData(task);
  },

  async deleteTask(
    taskId: string,
  ): Promise<string> {
    await wait(500);

    return taskId;
  },
};