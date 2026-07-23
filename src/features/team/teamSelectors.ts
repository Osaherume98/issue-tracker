import {
  createSelector,
} from '@reduxjs/toolkit';

import {
  employeesSelectors,
} from '../employees/employeesSlice';

import {
  taskSelectors,
} from '../tasks/tasksSlice';

export interface TeamMemberSummary {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
  totalTasks: number;
  todoTasks: number;
  inProgressTasks: number;
  reviewTasks: number;
  completedTasks: number;
}

export const selectTeamMemberSummaries =
  createSelector(
    [
      employeesSelectors.selectAll,
      taskSelectors.selectAll,
    ],

    (
      employees,
      tasks,
    ): TeamMemberSummary[] => {
      return employees.map((employee) => {
        const assignedTasks = tasks.filter(
          (task) =>
            task.assignedEmployeeIds.includes(
              employee.id,
            ),
        );

        return {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          initials: employee.initials,

          totalTasks: assignedTasks.length,

          todoTasks: assignedTasks.filter(
            (task) =>
              task.status === 'todo',
          ).length,

          inProgressTasks:
            assignedTasks.filter(
              (task) =>
                task.status ===
                'in-progress',
            ).length,

          reviewTasks: assignedTasks.filter(
            (task) =>
              task.status === 'review',
          ).length,

          completedTasks:
            assignedTasks.filter(
              (task) =>
                task.status ===
                'completed',
            ).length,
        };
      });
    },
  );

export const selectTeamStatistics =
  createSelector(
    [selectTeamMemberSummaries],
    (members) => {
      return {
        totalMembers: members.length,

        activeMembers: members.filter(
          (member) =>
            member.inProgressTasks > 0 ||
            member.reviewTasks > 0,
        ).length,

        membersWithoutTasks:
          members.filter(
            (member) =>
              member.totalTasks === 0,
          ).length,

        totalAssignments:
          members.reduce(
            (total, member) =>
              total +
              member.totalTasks,
            0,
          ),
      };
    },
  );