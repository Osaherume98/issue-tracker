import {
  configureStore,
  type UnknownAction,
} from '@reduxjs/toolkit';

import employeesReducer from '../features/employees/employeesSlice';
import filtersReducer from '../features/filters/filtersSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import projectsReducer from '../features/projects/projectsSlice';

import {
  taskSelectors,
} from '../features/tasks/tasksSlice';

import tasksReducer from '../features/tasks/tasksSlice';

import {
  listenerMiddleware,
} from './listenerMiddleware';

import {
  loadPersistedWorkspace,
  savePersistedWorkspace,
} from './persistence';

const initialiseAction: UnknownAction = {
  type: '@@teamflow/initialise',
};

const initialProjectsState =
  projectsReducer(
    undefined,
    initialiseAction,
  );

const initialEmployeesState =
  employeesReducer(
    undefined,
    initialiseAction,
  );

const initialTasksState =
  tasksReducer(
    undefined,
    initialiseAction,
  );

const initialFiltersState =
  filtersReducer(
    undefined,
    initialiseAction,
  );

const initialNotificationsState =
  notificationsReducer(
    undefined,
    initialiseAction,
  );

const persistedWorkspace =
  loadPersistedWorkspace();

const persistedTaskIds =
  persistedWorkspace?.tasks.map(
    (task) => task.id,
  ) ?? [];

const persistedTaskEntities =
  Object.fromEntries(
    (
      persistedWorkspace?.tasks ?? []
    ).map((task) => [
      task.id,
      task,
    ]),
  );

const preloadedState = {
  projects: {
    ...initialProjectsState,

    selectedProjectId:
      persistedWorkspace
        ?.selectedProjectId ?? null,
  },

  employees:
    initialEmployeesState,

  tasks: persistedWorkspace
    ? {
        ...initialTasksState,

        ids: persistedTaskIds,

        entities:
          persistedTaskEntities,

        status: 'succeeded' as const,

        error: null,

        mutationError: null,

        createStatus: 'idle' as const,

        updateStatus: 'idle' as const,

        updatingTaskIds: [],

        deletingTaskIds: [],
      }
    : initialTasksState,

  filters: persistedWorkspace
    ? {
        ...initialFiltersState,
        ...persistedWorkspace.filters,
      }
    : initialFiltersState,

  notifications: persistedWorkspace
    ? {
        ...initialNotificationsState,

        items:
          persistedWorkspace.notifications,

        panelOpen: false,
      }
    : initialNotificationsState,
};

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    employees: employeesReducer,
    tasks: tasksReducer,
    filters: filtersReducer,
    notifications:
      notificationsReducer,
  },

  middleware: (
    getDefaultMiddleware,
  ) =>
    getDefaultMiddleware().prepend(
      listenerMiddleware.middleware,
    ),

  preloadedState,
});

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;

export type AppStore =
  typeof store;

let persistenceTimeout:
  ReturnType<typeof setTimeout> | null =
    null;

store.subscribe(() => {
  if (persistenceTimeout) {
    clearTimeout(persistenceTimeout);
  }

  persistenceTimeout = setTimeout(() => {
    const state = store.getState();

    savePersistedWorkspace({
      selectedProjectId:
        state.projects.selectedProjectId,

      tasks:
        taskSelectors.selectAll(state),

      filters: {
        searchTerm:
          state.filters.searchTerm,

        employeeId:
          state.filters.employeeId,

        priority:
          state.filters.priority,

        overdueOnly:
          state.filters.overdueOnly,
      },

      notifications:
        state.notifications.items,
    });
  }, 250);
});