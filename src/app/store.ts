import { configureStore } from '@reduxjs/toolkit';

import employeesReducer from '../features/employees/employeesSlice';
import projectsReducer from '../features/projects/projectSlice';
import tasksReducer from '../features/tasks/taskSlice';


export const store =
  configureStore({

    reducer: {

      projects:
        projectsReducer,

      employees:
        employeesReducer,

      tasks:
        tasksReducer,

    },

  });


export type RootState =
  ReturnType<
    typeof store.getState
  >;


export type AppDispatch =
  typeof store.dispatch;