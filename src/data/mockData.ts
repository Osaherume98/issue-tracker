import type { Employee, Project, Task } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Customer Portal',
    description:
      'Build a new customer-facing portal for account and service management.',
    color: '#4f46e5',
    createdAt: '2026-07-01T09:00:00.000Z',
  },
  {
    id: 'project-2',
    name: 'Mobile Banking App',
    description:
      'Improve onboarding, payments and transaction monitoring.',
    color: '#0891b2',
    createdAt: '2026-07-03T10:30:00.000Z',
  },
  {
    id: 'project-3',
    name: 'Internal Analytics',
    description:
      'Create dashboards for operational and product performance.',
    color: '#9333ea',
    createdAt: '2026-07-05T08:15:00.000Z',
  },
];

export const mockEmployees: Employee[] = [
  {
    id: 'employee-1',
    name: 'Amina Yusuf',
    email: 'amina.yusuf@example.com',
    role: 'Frontend Developer',
    initials: 'AY',
  },
  {
    id: 'employee-2',
    name: 'Daniel Okafor',
    email: 'daniel.okafor@example.com',
    role: 'Backend Developer',
    initials: 'DO',
  },
  {
    id: 'employee-3',
    name: 'Grace Bello',
    email: 'grace.bello@example.com',
    role: 'Product Designer',
    initials: 'GB',
  },
  {
    id: 'employee-4',
    name: 'Samuel Adeyemi',
    email: 'samuel.adeyemi@example.com',
    role: 'Quality Assurance Engineer',
    initials: 'SA',
  },
  {
    id: 'employee-5',
    name: 'Fatima Ibrahim',
    email: 'fatima.ibrahim@example.com',
    role: 'Product Manager',
    initials: 'FI',
  },
];

export const mockTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'project-1',
    title: 'Design customer dashboard',
    description:
      'Create responsive dashboard screens for customer accounts and services.',
    status: 'completed',
    priority: 'high',
    assignedEmployeeIds: ['employee-3', 'employee-5'],
    dueDate: '2026-07-18',
    createdAt: '2026-07-08T09:00:00.000Z',
    updatedAt: '2026-07-18T13:30:00.000Z',
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: 'Implement authentication flow',
    description:
      'Build login, logout, password recovery and protected route handling.',
    status: 'in-progress',
    priority: 'urgent',
    assignedEmployeeIds: ['employee-1', 'employee-2'],
    dueDate: '2026-07-23',
    createdAt: '2026-07-10T10:00:00.000Z',
    updatedAt: '2026-07-20T08:00:00.000Z',
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    title: 'Test account settings page',
    description:
      'Test profile updates, password changes and notification preferences.',
    status: 'todo',
    priority: 'medium',
    assignedEmployeeIds: ['employee-4'],
    dueDate: '2026-07-26',
    createdAt: '2026-07-15T11:00:00.000Z',
    updatedAt: '2026-07-15T11:00:00.000Z',
  },
  {
    id: 'task-4',
    projectId: 'project-1',
    title: 'Review API error handling',
    description:
      'Check how API validation and server errors are shown to users.',
    status: 'review',
    priority: 'high',
    assignedEmployeeIds: ['employee-1', 'employee-2'],
    dueDate: '2026-07-22',
    createdAt: '2026-07-12T14:00:00.000Z',
    updatedAt: '2026-07-20T12:00:00.000Z',
  },
  {
    id: 'task-5',
    projectId: 'project-2',
    title: 'Create biometric login interface',
    description:
      'Design and implement the biometric authentication user flow.',
    status: 'in-progress',
    priority: 'high',
    assignedEmployeeIds: ['employee-1', 'employee-3'],
    dueDate: '2026-07-29',
    createdAt: '2026-07-14T08:30:00.000Z',
    updatedAt: '2026-07-19T09:45:00.000Z',
  },
  {
    id: 'task-6',
    projectId: 'project-2',
    title: 'Build transaction history endpoint',
    description:
      'Create paginated API support for filtering customer transactions.',
    status: 'todo',
    priority: 'medium',
    assignedEmployeeIds: ['employee-2'],
    dueDate: '2026-08-02',
    createdAt: '2026-07-17T10:30:00.000Z',
    updatedAt: '2026-07-17T10:30:00.000Z',
  },
  {
    id: 'task-7',
    projectId: 'project-3',
    title: 'Define dashboard metrics',
    description:
      'Agree on active users, conversion and support performance metrics.',
    status: 'review',
    priority: 'medium',
    assignedEmployeeIds: ['employee-5'],
    dueDate: '2026-07-24',
    createdAt: '2026-07-13T09:30:00.000Z',
    updatedAt: '2026-07-20T07:30:00.000Z',
  },
];