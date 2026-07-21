import {
  useEffect,
  useRef,
  useState,
} from 'react';

import Header from './components/Header';
import Sidebar from './components/Sidebar';

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
  projectsSelectors,
  selectProjectsError,
  selectProjectsStatus,
  selectSelectedProject,
  selectSelectedProjectId,
} from './features/projects/projectsSlice';


import {
  fetchTasks,
  selectTasksError,
  selectTasksStatus,
} from './features/tasks/tasksSlice';

function App() {
  const dispatch = useAppDispatch();

  const hasInitialised = useRef(false);

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const projects = useAppSelector(
    projectsSelectors.selectAll,
  );

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

  const selectedProject = useAppSelector(
    selectSelectedProject,
  );

  const selectedProjectId = useAppSelector(
    selectSelectedProjectId,
  );

useEffect(() => {
  if (hasInitialised.current) {
    return;
  }

  hasInitialised.current = true;

  void dispatch(fetchProjects());

  void dispatch(fetchEmployees());

  void dispatch(fetchTasks());

}, [dispatch]);

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
        />

        <main className="dashboard">
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
              <button
                type="button"
                className="secondary-button"
              >
                Export report
              </button>

              <button
                type="button"
                className="primary-button"
              >
                <span>+</span>
                New task
              </button>
            </div>
          </section>

          <section className="statistics-grid">
            <article className="statistic-card">
              <div className="statistic-card-header">
                <span>Total projects</span>
                <div className="statistic-icon">▦</div>
              </div>

              <strong>{projects.length}</strong>

              <p>
                <span className="positive-change">
                  Active
                </span>{' '}
                across the workspace
              </p>
            </article>

            <article className="statistic-card">
              <div className="statistic-card-header">
                <span>Team members</span>
                <div className="statistic-icon">♙</div>
              </div>

              <strong>{employees.length}</strong>

              <p>
                <span className="positive-change">
                  Available
                </span>{' '}
                for task assignment
              </p>
            </article>

            <article className="statistic-card">
              <div className="statistic-card-header">
                <span>In progress</span>
                <div className="statistic-icon">◷</div>
              </div>

              <strong>0</strong>

              <p>
                Task data will be connected next
              </p>
            </article>

            <article className="statistic-card">
              <div className="statistic-card-header">
                <span>Completed</span>
                <div className="statistic-icon">✓</div>
              </div>

              <strong>0</strong>

              <p>
                Calculated from Redux selectors
              </p>
            </article>
          </section>

          <section className="board-section">
            <div className="board-toolbar">
              <div>
                <h2>Task board</h2>

                <p>
                  Organise and monitor work across each
                  stage.
                </p>
              </div>

              <div className="board-toolbar-actions">
                <button
                  type="button"
                  className="filter-button"
                >
                  Filter
                </button>

                <button
                  type="button"
                  className="filter-button"
                >
                  Sort by
                </button>
              </div>
            </div>

            <div className="kanban-board">
              <article className="kanban-column">
                <header className="kanban-column-header">
                  <div>
                    <span className="status-marker status-marker--todo" />
                    <h3>To do</h3>
                  </div>

                  <span className="column-count">0</span>
                </header>

                <div className="empty-column">
                  <span>＋</span>
                  <p>Tasks will appear here</p>
                </div>
              </article>

              <article className="kanban-column">
                <header className="kanban-column-header">
                  <div>
                    <span className="status-marker status-marker--progress" />
                    <h3>In progress</h3>
                  </div>

                  <span className="column-count">0</span>
                </header>

                <div className="empty-column">
                  <span>＋</span>
                  <p>Tasks will appear here</p>
                </div>
              </article>

              <article className="kanban-column">
                <header className="kanban-column-header">
                  <div>
                    <span className="status-marker status-marker--review" />
                    <h3>Review</h3>
                  </div>

                  <span className="column-count">0</span>
                </header>

                <div className="empty-column">
                  <span>＋</span>
                  <p>Tasks will appear here</p>
                </div>
              </article>

              <article className="kanban-column">
                <header className="kanban-column-header">
                  <div>
                    <span className="status-marker status-marker--completed" />
                    <h3>Completed</h3>
                  </div>

                  <span className="column-count">0</span>
                </header>

                <div className="empty-column">
                  <span>＋</span>
                  <p>Tasks will appear here</p>
                </div>
              </article>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;