import {
  configureStore,
} from '@reduxjs/toolkit';

import employeesReducer from '../features/employees/employeesSlice';
import filtersReducer from '../features/filters/filtersSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import projectsReducer from '../features/projects/projectsSlice';
import tasksReducer from '../features/tasks/tasksSlice';

import {
  listenerMiddleware,
} from './listenerMiddleware';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    employees: employeesReducer,
    tasks: tasksReducer,
    filters: filtersReducer,
    notifications: notificationsReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(
      listenerMiddleware.middleware,
    ),
});

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;