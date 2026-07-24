import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react';

import {
  useAppDispatch,
  useAppSelector,
} from '../../app/hooks';

import type {
  CreateTaskInput,
  TaskPriority,
  TaskStatus,
  UpdateTaskInput,
} from '../../types';

import {
  employeesSelectors,
} from '../employees/employeesSlice';

import {
  projectsSelectors,
  selectSelectedProjectId,
} from '../projects/projectsSlice';

import {
  createTask,
  selectTaskCreateStatus,
  selectTaskUpdateStatus,
  taskCreateStatusReset,
  taskMutationErrorCleared,
  taskSelectors,
  taskUpdateStatusReset,
  updateTask,
} from './tasksSlice';

interface TaskFormModalProps {
  isOpen: boolean;
  editingTaskId: string | null;
  onClose: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  projectId?: string;
  dueDate?: string;
}

const initialFormState: CreateTaskInput = {
  projectId: '',
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  assignedEmployeeIds: [],
  dueDate: '',
};

function TaskFormModal({
  isOpen,
  editingTaskId,
  onClose,
}: TaskFormModalProps) {
  const dispatch = useAppDispatch();

  const projects = useAppSelector(
    projectsSelectors.selectAll,
  );

  const employees = useAppSelector(
    employeesSelectors.selectAll,
  );

  const selectedProjectId = useAppSelector(
    selectSelectedProjectId,
  );

  const editingTask = useAppSelector((state) =>
    editingTaskId
      ? taskSelectors.selectById(
          state,
          editingTaskId,
        )
      : undefined,
  );

  const createStatus = useAppSelector(
    selectTaskCreateStatus,
  );

  const updateStatus = useAppSelector(
    selectTaskUpdateStatus,
  );

  const createInitialFormData =
    (): CreateTaskInput => {
      if (editingTask) {
        return {
          projectId: editingTask.projectId,
          title: editingTask.title,
          description: editingTask.description,
          status: editingTask.status,
          priority: editingTask.priority,
          assignedEmployeeIds: [
            ...editingTask.assignedEmployeeIds,
          ],
          dueDate: editingTask.dueDate,
        };
      }

      return {
        ...initialFormState,
        projectId:
          selectedProjectId ??
          projects[0]?.id ??
          '',
      };
    };

  const [formData, setFormData] =
    useState<CreateTaskInput>(
      createInitialFormData,
    );

  const [errors, setErrors] =
    useState<FormErrors>({});

  const isEditing =
    editingTaskId !== null;

  const isSubmitting =
    createStatus === 'loading' ||
    updateStatus === 'loading';

  useEffect(() => {
    dispatch(taskMutationErrorCleared());
    dispatch(taskCreateStatusReset());
    dispatch(taskUpdateStatusReset());
  }, [dispatch]);

  useEffect(() => {
    const operationSucceeded =
      createStatus === 'succeeded' ||
      updateStatus === 'succeeded';

    if (!isOpen || !operationSucceeded) {
      return;
    }

    onClose();

    dispatch(taskCreateStatusReset());
    dispatch(taskUpdateStatusReset());
  }, [
    createStatus,
    dispatch,
    isOpen,
    onClose,
    updateStatus,
  ]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ): void => {
      if (
        event.key === 'Escape' &&
        !isSubmitting
      ) {
        onClose();
      }
    };

    document.addEventListener(
      'keydown',
      handleKeyDown,
    );

    const previousBodyOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      'hidden';

    return () => {
      document.removeEventListener(
        'keydown',
        handleKeyDown,
      );

      document.body.style.overflow =
        previousBodyOverflow;
    };
  }, [
    isOpen,
    isSubmitting,
    onClose,
  ]);

  if (!isOpen) {
    return null;
  }

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    const trimmedTitle =
      formData.title.trim();

    const trimmedDescription =
      formData.description.trim();

    if (!trimmedTitle) {
      nextErrors.title =
        'Task title is required.';
    } else if (
      trimmedTitle.length > 100
    ) {
      nextErrors.title =
        'Task title must not exceed 100 characters.';
    }

    if (!trimmedDescription) {
      nextErrors.description =
        'Description is required.';
    }

    if (!formData.projectId) {
      nextErrors.projectId =
        'Select a project.';
    }

    if (!formData.dueDate) {
      nextErrors.dueDate =
        'Select a due date.';
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const updateField = <
    Key extends keyof CreateTaskInput,
  >(
    key: Key,
    value: CreateTaskInput[Key],
  ): void => {
    setFormData((current) => ({
      ...current,
      [key]: value,
    }));

    if (
      key === 'title' ||
      key === 'description' ||
      key === 'projectId' ||
      key === 'dueDate'
    ) {
      setErrors((current) => ({
        ...current,
        [key]: undefined,
      }));
    }
  };

  const handleEmployeeChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const employeeId =
      event.target.value;

    const isChecked =
      event.target.checked;

    setFormData((current) => {
      const alreadyAssigned =
        current.assignedEmployeeIds.includes(
          employeeId,
        );

      if (isChecked && !alreadyAssigned) {
        return {
          ...current,
          assignedEmployeeIds: [
            ...current.assignedEmployeeIds,
            employeeId,
          ],
        };
      }

      if (!isChecked && alreadyAssigned) {
        return {
          ...current,
          assignedEmployeeIds:
            current.assignedEmployeeIds.filter(
              (id) => id !== employeeId,
            ),
        };
      }

      return current;
    });
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ): void => {
    event.preventDefault();

    if (
      !validateForm() ||
      isSubmitting
    ) {
      return;
    }

    const cleanedInput: CreateTaskInput = {
      ...formData,
      title: formData.title.trim(),
      description:
        formData.description.trim(),
      assignedEmployeeIds: [
        ...formData.assignedEmployeeIds,
      ],
    };

    if (isEditing && editingTaskId) {
      const updateInput: UpdateTaskInput = {
        id: editingTaskId,
        ...cleanedInput,
      };

      void dispatch(
        updateTask(updateInput),
      );

      return;
    }

    void dispatch(
      createTask(cleanedInput),
    );
  };

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={handleClose}
    >
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >
        <header className="task-modal-header">
          <div>
            <p className="task-modal-eyebrow">
              {isEditing
                ? 'Update work item'
                : 'New work item'}
            </p>

            <h2 id="task-form-title">
              {isEditing
                ? 'Edit task'
                : 'Create task'}
            </h2>

            <p>
              {isEditing
                ? 'Update the task details, assignment and workflow status.'
                : 'Add a task and assign it to the right project and team members.'}
            </p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Close task form"
          >
            ×
          </button>
        </header>

        <form
          className="task-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="form-field">
            <label htmlFor="task-title">
              Task title
            </label>

            <input
              id="task-title"
              type="text"
              value={formData.title}
              onChange={(event) =>
                updateField(
                  'title',
                  event.target.value,
                )
              }
              placeholder="Example: Build account settings page"
              disabled={isSubmitting}
              maxLength={100}
              autoFocus
            />

            <div className="field-support-row">
              <span className="field-error">
                {errors.title ?? ''}
              </span>

              <span>
                {formData.title.length}/100
              </span>
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              value={formData.description}
              onChange={(event) =>
                updateField(
                  'description',
                  event.target.value,
                )
              }
              placeholder="Describe the expected outcome and important details."
              rows={4}
              disabled={isSubmitting}
            />

            {errors.description && (
              <span className="field-error">
                {errors.description}
              </span>
            )}
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="task-project">
                Project
              </label>

              <select
                id="task-project"
                value={formData.projectId}
                onChange={(event) =>
                  updateField(
                    'projectId',
                    event.target.value,
                  )
                }
                disabled={isSubmitting}
              >
                <option value="">
                  Select project
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              {errors.projectId && (
                <span className="field-error">
                  {errors.projectId}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="task-due-date">
                Due date
              </label>

              <input
                id="task-due-date"
                type="date"
                value={formData.dueDate}
                onChange={(event) =>
                  updateField(
                    'dueDate',
                    event.target.value,
                  )
                }
                disabled={isSubmitting}
              />

              {errors.dueDate && (
                <span className="field-error">
                  {errors.dueDate}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="task-status">
                Status
              </label>

              <select
                id="task-status"
                value={formData.status}
                onChange={(event) =>
                  updateField(
                    'status',
                    event.target
                      .value as TaskStatus,
                  )
                }
                disabled={isSubmitting}
              >
                <option value="todo">
                  To do
                </option>

                <option value="in-progress">
                  In progress
                </option>

                <option value="review">
                  Review
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="task-priority">
                Priority
              </label>

              <select
                id="task-priority"
                value={formData.priority}
                onChange={(event) =>
                  updateField(
                    'priority',
                    event.target
                      .value as TaskPriority,
                  )
                }
                disabled={isSubmitting}
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

                <option value="urgent">
                  Urgent
                </option>
              </select>
            </div>
          </div>

          <fieldset className="assignee-fieldset">
            <legend>
              Assign team members
            </legend>

            <p>
              You can assign more than one
              person to this task.
            </p>

            <div className="assignee-grid">
              {employees.map((employee) => {
                const isSelected =
                  formData.assignedEmployeeIds.includes(
                    employee.id,
                  );

                return (
                  <label
                    key={employee.id}
                    className={`assignee-option ${
                      isSelected
                        ? 'assignee-option--selected'
                        : ''
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={employee.id}
                      checked={isSelected}
                      onChange={
                        handleEmployeeChange
                      }
                      disabled={isSubmitting}
                    />

                    <span className="assignee-avatar">
                      {employee.initials}
                    </span>

                    <span className="assignee-details">
                      <strong>
                        {employee.name}
                      </strong>

                      <small>
                        {employee.role}
                      </small>
                    </span>

                    <span className="assignee-check">
                      {isSelected ? '✓' : ''}
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <footer className="task-modal-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing
                  ? 'Saving changes...'
                  : 'Creating task...'
                : isEditing
                  ? 'Save changes'
                  : 'Create task'}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}

export default TaskFormModal;