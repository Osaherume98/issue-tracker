import type { ChangeEvent } from 'react';

import {
  useAppDispatch,
  useAppSelector,
} from '../../app/hooks';

import type {
  Task,
  TaskStatus,
} from '../../types';

import {
  employeesSelectors,
} from '../employees/employeesSlice';

import {
  changeTaskStatus,
  removeTask,
  selectIsTaskDeleting,
  selectIsTaskUpdating,
} from './tasksSlice';

import {
  CalendarDays,
  Pencil,
  Trash2,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
}

const taskStatusOptions: Array<{
  value: TaskStatus;
  label: string;
}> = [
  {
    value: 'todo',
    label: 'To do',
  },
  {
    value: 'in-progress',
    label: 'In progress',
  },
  {
    value: 'review',
    label: 'Review',
  },
  {
    value: 'completed',
    label: 'Completed',
  },
];

const formatDueDate = (dueDate: string): string => {
  const date = new Date(`${dueDate}T00:00:00`);

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

function TaskCard({
  task,
  onEdit,
}: TaskCardProps) {
  const dispatch = useAppDispatch();


  const employees = useAppSelector(
    employeesSelectors.selectAll,
  );

  const isUpdating = useAppSelector((state) =>
    selectIsTaskUpdating(state, task.id),
  );

  const isDeleting = useAppSelector((state) =>
    selectIsTaskDeleting(state, task.id),
  );

  const assignedEmployees = employees.filter(
    (employee) =>
      task.assignedEmployeeIds.includes(employee.id),
  );

  const isBusy = isUpdating || isDeleting;

  const handleStatusChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ): void => {
    const status = event.target.value as TaskStatus;

    if (status === task.status || isBusy) {
      return;
    }

    void dispatch(
      changeTaskStatus({
        taskId: task.id,
        status,
      }),
    );
  };

  const handleDelete = (): void => {
    if (isBusy) {
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${task.title}"?`,
    );

    if (!shouldDelete) {
      return;
    }

    void dispatch(removeTask(task.id));
  };

  return (
    <article
      className={`task-card ${
        isDeleting ? 'task-card--deleting' : ''
      }`}
    >
      <div className="task-card-header">
        <h4>{task.title}</h4>

        <span
          className={`priority priority-${task.priority}`}
        >
          {task.priority}
        </span>
      </div>

      <p className="task-description">
        {task.description}
      </p>

      <div className="task-meta">
        <CalendarDays size={14} />
        <span>
          Due: {formatDueDate(task.dueDate)}
        </span>
      </div>

      <label className="task-status-control">
        <span>Status</span>

        <select
          value={task.status}
          onChange={handleStatusChange}
          disabled={isBusy}
          aria-label={`Change status for ${task.title}`}
        >
          {taskStatusOptions.map((option) => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <div className="task-footer">
        <div
          className="employee-avatars"
          aria-label="Assigned employees"
        >
          {assignedEmployees.length > 0 ? (
            assignedEmployees.map((employee) => (
              <span
                key={employee.id}
                className="employee-avatar"
                title={`${employee.name} — ${employee.role}`}
              >
                {employee.initials}
              </span>
            ))
          ) : (
            <span className="unassigned-label">
              Unassigned
            </span>
          )}
        </div>

      <div className="task-card-actions">
        {isUpdating && (
            <span className="task-operation-text">
            Updating...
            </span>
        )}

        {isDeleting && (
            <span className="task-operation-text">
            Deleting...
            </span>
        )}

        <button
            type="button"
            className="task-edit-button"
            onClick={onEdit}
            disabled={isBusy}
            aria-label={`Edit ${task.title}`}
        >
          <Pencil size={14} />
            Edit
        </button>

        <button
            type="button"
            className="task-delete-button"
            onClick={handleDelete}
            disabled={isBusy}
            aria-label={`Delete ${task.title}`}
        >
            <Trash2 size={14} />
            Delete
        </button>
      </div>
      </div>
    </article>
  );
}

export default TaskCard;