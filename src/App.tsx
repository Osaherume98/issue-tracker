import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskBoard from './features/tasks/TaskBoard';

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
  selectTaskStatistics,
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

  const taskStatistics = useAppSelector(
    selectTaskStatistics,
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
                <span>Total task</span>
                <div className="statistic-icon">▦</div>
              </div>

              <strong>{taskStatistics.total}</strong>

              <p>
                <span className="positive-change">
                  {taskStatistics.todo}
                </span>{' '}
                waiting to be started
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

              <strong>
                {taskStatistics.inProgress}
              </strong>

              <p>
                {taskStatistics.review} task
                {taskStatistics.review === 1
                  ? ''
                  : 's'}{' '}
                currently under review
              </p>
            </article>

            <article className="statistic-card">
              <div className="statistic-card-header">
                <span>Completed</span>
                <div className="statistic-icon">✓</div>
              </div>

              <strong>
                {taskStatistics.completed}
              </strong>

              <p>
                {taskStatistics.total === 0
                  ? 'No tasks in the selected project'
                  : `${Math.round(
                      (taskStatistics.completed /
                        taskStatistics.total) * 100
                    )}% completion rate`}
              </p>
            </article>
          </section>

          <section className="board-section">

            <div className="board-toolbar">

              <div>
                <h2>
                  Task board
                </h2>

                <p>
                  {taskStatistics.total} task
                  {taskStatistics.total === 1 ? '' : 's'}{' '}
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


            <TaskBoard />


          </section>
        </main>
      </div>
    </div>
  );
}

export default App;