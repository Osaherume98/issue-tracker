import type { Task } from '../../types';

import {
  useAppSelector,
} from '../../app/hooks';

import {
  selectHasActiveFilters,
} from '../filters/filtersSlice';

import {
  selectTaskStatistics,
} from './tasksSlice';

import TaskBoard from './TaskBoard';

interface TaskBoardViewProps {
  onCreateTask: () => void;
  onEditTask: (task: Task) => void;
  onOpenFilters: () => void;
}

function TaskBoardView({
  onCreateTask,
  onEditTask,
  onOpenFilters,
}: TaskBoardViewProps) {
  const taskStatistics = useAppSelector(
    selectTaskStatistics,
  );

  const hasActiveFilters =
    useAppSelector(
      selectHasActiveFilters,
    );

  return (
    <section className="workspace-view">
      <header className="view-heading">
        <div>
          <p className="page-eyebrow">
            Delivery workspace
          </p>

          <h1>Task board</h1>

          <p>
            Create, assign and move tasks
            through each delivery stage.
          </p>
        </div>

        <div className="dashboard-heading-actions">
          <button
            type="button"
            className={`filter-button ${
              hasActiveFilters
                ? 'filter-button--active'
                : ''
            }`}
            onClick={onOpenFilters}
          >
            Filter

            {hasActiveFilters && (
              <span className="active-filter-dot" />
            )}
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={onCreateTask}
          >
            <span>+</span>
            New task
          </button>
        </div>
      </header>

      <section className="task-board-summary">
        <article>
          <span>Total</span>
          <strong>
            {taskStatistics.total}
          </strong>
        </article>

        <article>
          <span>To do</span>
          <strong>
            {taskStatistics.todo}
          </strong>
        </article>

        <article>
          <span>In progress</span>
          <strong>
            {taskStatistics.inProgress}
          </strong>
        </article>

        <article>
          <span>Review</span>
          <strong>
            {taskStatistics.review}
          </strong>
        </article>

        <article>
          <span>Completed</span>
          <strong>
            {taskStatistics.completed}
          </strong>
        </article>
      </section>

      <section className="board-section">
        <div className="board-toolbar">
          <div>
            <h2>Kanban board</h2>

            <p>
              {taskStatistics.total} matching{' '}
              {taskStatistics.total === 1
                ? 'task'
                : 'tasks'}{' '}
              across the selected workspace.
            </p>
          </div>
        </div>

        <TaskBoard
          onEditTask={onEditTask}
        />
      </section>
    </section>
  );
}

export default TaskBoardView;