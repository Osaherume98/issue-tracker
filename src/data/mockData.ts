import type { Employee, Project, Task } from '../types';

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'CML',
    description:
      'builds systems that effectively manage your supply chain operations from warehouse management to air freight mobility and distribution.',
    color: '#FA0007',
    createdAt: '2026-07-01T09:00:00.000Z',
  },
  {
    id: 'project-2',
    name: 'LogiRate',
    description:
      'Rating SystemBuilt for Businesses',
    color: '#3C80FF',
    createdAt: '2026-07-03T10:30:00.000Z',
  },
];

export const mockEmployees: Employee[] = [
  {
    id: 'employee-1',
    name: 'Emmanuel',
    email: 'emmanuel@gmail.com',
    role: 'Backend Developer',
    initials: 'EM',
  },
  {
    id: 'employee-2',
    name: 'Olayemi Abimbola',
    email: 'olayemiabimbola@gmail.com',
    role: 'Frontend Developer',
    initials: 'OA',
  },
  {
    id: 'employee-3',
    name: 'Gilbert Aya',
    email: 'gilbertaya@gmail.com',
    role: 'Quality Assurance',
    initials: 'GA',
  },
  {
    id: 'employee-4',
    name: 'Lizzy Baby',
    email: 'lizzybaby@gmail.com',
    role: 'UI/UX Designer',
    initials: 'LB',
  },
  {
    id: 'employee-5',
    name: 'Vanessa Nzurum',
    email: 'vanessanzurum@gmail.com',
    role: 'Product Manager',
    initials: 'VN',
  },
  {
    id: 'employee-6',
    name: 'Osaherume Ibrahim',
    email: 'osaherumeibrahim@gmail.com',
    role: 'Junior Frontend Developer',
    initials: 'OI',
  },
];

export const mockTasks: Task[] = [
//   {
//     id: 'task-1',
//     projectId: 'project-1',
//     title: 'Design customer dashboard',
//     description:
//       'Create responsive dashboard screens for customer accounts and services.',
//     status: 'completed',
//     priority: 'high',
//     assignedEmployeeIds: ['employee-3', 'employee-5'],
//     dueDate: '2026-07-18',
//     createdAt: '2026-07-08T09:00:00.000Z',
//     updatedAt: '2026-07-18T13:30:00.000Z',
//   },
//   {
//     id: 'task-2',
//     projectId: 'project-1',
//     title: 'Implement authentication flow',
//     description:
//       'Build login, logout, password recovery and protected route handling.',
//     status: 'in-progress',
//     priority: 'urgent',
//     assignedEmployeeIds: ['employee-1', 'employee-2'],
//     dueDate: '2026-07-23',
//     createdAt: '2026-07-10T10:00:00.000Z',
//     updatedAt: '2026-07-20T08:00:00.000Z',
//   },
//   {
//     id: 'task-3',
//     projectId: 'project-1',
//     title: 'Test account settings page',
//     description:
//       'Test profile updates, password changes and notification preferences.',
//     status: 'todo',
//     priority: 'medium',
//     assignedEmployeeIds: ['employee-4'],
//     dueDate: '2026-07-26',
//     createdAt: '2026-07-15T11:00:00.000Z',
//     updatedAt: '2026-07-15T11:00:00.000Z',
//   },
//   {
//     id: 'task-4',
//     projectId: 'project-1',
//     title: 'Review API error handling',
//     description:
//       'Check how API validation and server errors are shown to users.',
//     status: 'review',
//     priority: 'high',
//     assignedEmployeeIds: ['employee-1', 'employee-2'],
//     dueDate: '2026-07-22',
//     createdAt: '2026-07-12T14:00:00.000Z',
//     updatedAt: '2026-07-20T12:00:00.000Z',
//   },
//   {
//     id: 'task-5',
//     projectId: 'project-2',
//     title: 'Create biometric login interface',
//     description:
//       'Design and implement the biometric authentication user flow.',
//     status: 'in-progress',
//     priority: 'high',
//     assignedEmployeeIds: ['employee-1', 'employee-3'],
//     dueDate: '2026-07-29',
//     createdAt: '2026-07-14T08:30:00.000Z',
//     updatedAt: '2026-07-19T09:45:00.000Z',
//   },
//   {
//     id: 'task-6',
//     projectId: 'project-2',
//     title: 'Build transaction history endpoint',
//     description:
//       'Create paginated API support for filtering customer transactions.',
//     status: 'todo',
//     priority: 'medium',
//     assignedEmployeeIds: ['employee-2'],
//     dueDate: '2026-08-02',
//     createdAt: '2026-07-17T10:30:00.000Z',
//     updatedAt: '2026-07-17T10:30:00.000Z',
//   },
//   {
//     id: 'task-7',
//     projectId: 'project-3',
//     title: 'Define dashboard metrics',
//     description:
//       'Agree on active users, conversion and support performance metrics.',
//     status: 'review',
//     priority: 'medium',
//     assignedEmployeeIds: ['employee-5'],
//     dueDate: '2026-07-24',
//     createdAt: '2026-07-13T09:30:00.000Z',
//     updatedAt: '2026-07-20T07:30:00.000Z',
//   },
];