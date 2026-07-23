import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskBoard from './features/tasks/TaskBoard';
import TaskFormModal from './features/tasks/TaskFormModal';
import TaskFilters from './features/filters/TaskFilters';
import type { Task } from './types';

import NotificationPanel from './features/notifications/NotificationPanel';

import TeamMembersView from './features/team/TeamMembersView';

import TaskBoardView from './features/tasks/TaskBoardView';

import {
  selectActiveView,
  activeViewChanged,
} from './features/ui/uiSlice';

import {
  selectNotificationPanelOpen,
} from './features/notifications/notificationsSlice';

import {
  useAppDispatch,
  useAppSelector,
} from './app/hooks';

import {
  employeesSelectors,
  fetchEmployees,
  selectEmployeesError,
  selectEmployeesStatus,
} from './features/employees/employeesSlice';


import {
  fetchProjects,
  selectProjectsError,
  selectProjectsStatus,
  selectSelectedProject,
  selectSelectedProjectId,
} from './features/projects/projectsSlice';


import {
  fetchTasks,
  selectTaskMutationError,
  selectTaskStatistics,
  selectTasksError,
  selectTasksStatus,
  taskMutationErrorCleared
} from './features/tasks/tasksSlice';

function App() {
  const dispatch = useAppDispatch();

  const hasInitialised = useRef(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [taskModalOpen, setTaskModalOpen] =
    useState(false);

  const [editingTaskId, setEditingTaskId] =
    useState<string | null>(null);

  const employees = useAppSelector(
    employeesSelectors.selectAll,
  );

  const projectsStatus = useAppSelector(
    selectProjectsStatus,
  );

  const employeesStatus = useAppSelector(
    selectEmployeesStatus,
  );

  const tasksStatus = useAppSelector(
    selectTasksStatus,
  );``

  const projectsError = useAppSelector(
    selectProjectsError,
  );

  const employeesError = useAppSelector(
    selectEmployeesError,
  );

    const tasksError = useAppSelector(
    selectTasksError,
  );

  const taskStatistics = useAppSelector(
    selectTaskStatistics,
  );

  const selectedProject = useAppSelector(
    selectSelectedProject,
  );

  const selectedProjectId = useAppSelector(
    selectSelectedProjectId,
  );

  const taskMutationError = useAppSelector(
    selectTaskMutationError
  );

  const activeView = useAppSelector(
  selectActiveView,
);

  const [filtersOpen, setFiltersOpen] =
    useState(false);

   const notificationPanelOpen =
    useAppSelector(
    selectNotificationPanelOpen,
  );

   
useEffect(() => {
  if (hasInitialised.current) {
    return;
  }

  hasInitialised.current = true;

  void dispatch(fetchProjects());

  void dispatch(fetchEmployees());

  if (tasksStatus === 'idle') {
    void dispatch(fetchTasks());
  }
}, [dispatch, tasksStatus]);

const isLoading =
  projectsStatus === 'loading' ||
  employeesStatus === 'loading' ||
  tasksStatus === 'loading' ||
  projectsStatus === 'idle' ||
  employeesStatus === 'idle' ||
  tasksStatus === 'idle';

  const hasError =
    projectsStatus === 'failed' ||
    employeesStatus === 'failed' ||
    tasksStatus === 'failed';

  const handleRetry = (): void => {
    void dispatch(fetchProjects());
    void dispatch(fetchEmployees());
    void dispatch(fetchTasks());
  };

  const handleCreateTask = (): void => {
    setEditingTaskId(null);
    setTaskModalOpen(true);
  };

  const handleEditTask = (
    task: Task,
  ): void => {
    setEditingTaskId(task.id);
    setTaskModalOpen(true);
  };

  const handleCloseTaskModal = (): void => {
    setTaskModalOpen(false);
    setEditingTaskId(null);
  };

  if (isLoading) {
    return (
      <main className="full-page-state">
        <div className="loading-spinner" />

        <h1>Preparing your workspace</h1>

        <p>
          Loading projects, employees and workspace
          settings.
        </p>
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="full-page-state">
        <div className="error-state-icon">!</div>

        <h1>We could not load the workspace</h1>

        <p>
          {projectsError ??
            employeesError ??
            tasksError ??
            'An unexpected error occurred.'}
        </p>

        <button
          type="button"
          className="retry-button"
          onClick={handleRetry}
        >
          Try again
        </button>
      </main>
    );
  }

  return (
    <div className="application-shell">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="application-content">
        <Header
          onOpenSidebar={() =>
            setSidebarOpen(true)
          }
          onCreateTask={handleCreateTask}
        />

<main className="dashboard">
  {taskMutationError && (
    <div
      className="mutation-error"
      role="alert"
    >
      <span>
        {taskMutationError}
      </span>

      <button
        type="button"
        onClick={() =>
          dispatch(
            taskMutationErrorCleared(),
          )
        }
        aria-label="Dismiss task error"
      >
        ×
      </button>
    </div>
  )}

  {activeView === 'overview' && (
    <>
      <section className="dashboard-heading">
        <div>
          <p className="page-eyebrow">
            Project overview
          </p>

          <h1>
            {selectedProjectId &&
            selectedProject
              ? selectedProject.name
              : 'All projects'}
          </h1>

          <p>
            {selectedProject?.description ??
              'Monitor team activity and manage work across every active project.'}
          </p>
        </div>

        <div className="dashboard-heading-actions">
          {/* <button
            type="button"
            className="secondary-button"
          >
            Export report
          </button> */}

          <button
            type="button"
            className="primary-button"
            onClick={handleCreateTask}
          >
            <span>+</span>
            New task
          </button>
        </div>
      </section>

      <section className="statistics-grid">
        <article className="statistic-card">
          <div className="statistic-card-header">
            <span>Total tasks</span>

            <div className="statistic-icon">
              ▦
            </div>
          </div>

          <strong>
            {taskStatistics.total}
          </strong>

          <p>
            {taskStatistics.todo}{' '}
            waiting to be started
          </p>
        </article>

        <article className="statistic-card">
          <div className="statistic-card-header">
            <span>Team members</span>

            <div className="statistic-icon">
              ♙
            </div>
          </div>

          <strong>
            {employees.length}
          </strong>

          <p>
            Available for task assignment
          </p>
        </article>

        <article className="statistic-card">
          <div className="statistic-card-header">
            <span>In progress</span>

            <div className="statistic-icon">
              ◷
            </div>
          </div>

          <strong>
            {taskStatistics.inProgress}
          </strong>

          <p>
            {taskStatistics.overdue}{' '}
            overdue{' '}
            {taskStatistics.overdue === 1
              ? 'task'
              : 'tasks'}{' '}
            need attention
          </p>
        </article>

        <article className="statistic-card">
          <div className="statistic-card-header">
            <span>Completed</span>

            <div className="statistic-icon">
              ✓
            </div>
          </div>

          <strong>
            {taskStatistics.completed}
          </strong>

          <p>
            {taskStatistics.total === 0
              ? 'No tasks in this project'
              : `${Math.round(
                  (taskStatistics.completed /
                    taskStatistics.total) *
                    100,
                )}% completion rate`}
          </p>
        </article>
      </section>

      <section className="board-section">
        <div className="board-toolbar">
          <div>
            <h2>Recent task board</h2>

            <p>
              Monitor work across each
              delivery stage.
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={() =>
              dispatch(
                activeViewChanged(
                  'tasks',
                ),
              )
            }
          >
            Open full board
          </button>
        </div>

        <TaskBoard
          onEditTask={handleEditTask}
        />
      </section>
    </>
  )}

  {activeView === 'tasks' && (
    <TaskBoardView
      onCreateTask={handleCreateTask}
      onEditTask={handleEditTask}
      onOpenFilters={() =>
        setFiltersOpen(true)
      }
    />
  )}

  {activeView === 'team' && (
    <TeamMembersView />
  )}
</main>
      </div>

      <TaskFilters
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <TaskFormModal
        isOpen={taskModalOpen}
        editingTaskId={editingTaskId}
        onClose={handleCloseTaskModal}
      />

      {notificationPanelOpen && (
        <NotificationPanel />
    )}

    </div>
  );
}

export default App;