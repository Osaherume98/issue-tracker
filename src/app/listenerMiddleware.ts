import {
  createListenerMiddleware,
  isAnyOf,
} from '@reduxjs/toolkit';

import {
  notificationAdded,
} from '../features/notifications/notificationsSlice';

import {
  changeTaskStatus,
  createTask,
  removeTask,
  updateTask,
} from '../features/tasks/tasksSlice';

import type {
  AppDispatch,
  RootState,
} from './store';

export const listenerMiddleware =
  createListenerMiddleware();

export const startAppListening =
  listenerMiddleware.startListening.withTypes<
    RootState,
    AppDispatch
  >();

startAppListening({
  matcher: isAnyOf(
    createTask.fulfilled,
    updateTask.fulfilled,
    changeTaskStatus.fulfilled,
  ),

  effect: (action, listenerApi) => {
    let message = 'Task updated successfully.';

    if (createTask.fulfilled.match(action)) {
      message = `"${action.payload.title}" was created.`;
    }

    if (updateTask.fulfilled.match(action)) {
      message = `"${action.payload.title}" was updated.`;
    }

    if (
      changeTaskStatus.fulfilled.match(action)
    ) {
      const statusLabels = {
        todo: 'To do',
        'in-progress': 'In progress',
        review: 'Review',
        completed: 'Completed',
      } as const;

      message = `"${action.payload.title}" moved to ${
        statusLabels[action.payload.status]
      }.`;
    }

    listenerApi.dispatch(
      notificationAdded({
        message,
        type: 'success',
      }),
    );
  },
});

startAppListening({
  actionCreator: removeTask.fulfilled,

  effect: (_, listenerApi) => {
    listenerApi.dispatch(
      notificationAdded({
        message: 'Task deleted successfully.',
        type: 'success',
      }),
    );
  },
});

startAppListening({
  matcher: isAnyOf(
    createTask.rejected,
    updateTask.rejected,
    changeTaskStatus.rejected,
    removeTask.rejected,
  ),

  effect: (action, listenerApi) => {
    const fallbackMessage =
      'The task operation could not be completed.';

    let message = fallbackMessage;

    if (createTask.rejected.match(action)) {
      message =
        typeof action.payload === 'string'
          ? action.payload
          : action.error.message ??
            fallbackMessage;
    } else if (updateTask.rejected.match(action)) {
      message =
        typeof action.payload === 'string'
          ? action.payload
          : action.error.message ??
            fallbackMessage;
    } else if (
      changeTaskStatus.rejected.match(action)
    ) {
      message =
        typeof action.payload === 'string'
          ? action.payload
          : action.error.message ??
            fallbackMessage;
    } else if (removeTask.rejected.match(action)) {
      message =
        typeof action.payload === 'string'
          ? action.payload
          : action.error.message ??
            fallbackMessage;
    }

    listenerApi.dispatch(
      notificationAdded({
        message,
        type: 'error',
      }),
    );
  },
});