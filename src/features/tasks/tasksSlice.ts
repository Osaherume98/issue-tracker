import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';

import { mockApi } from '../../services/mockApi';

import type {
  CreateTaskInput,
  RequestStatus,
  Task,
  TaskStatus,
} from '../../types';

interface TasksAdditionalState {
  status: RequestStatus;
  error: string | null;
  mutationError: string | null;
  createStatus: RequestStatus;
  updatingTaskIds: string[];
  deletingTaskIds: string[];
}

interface ChangeTaskStatusInput {
  taskId: string;
  status: TaskStatus;
}

export const tasksAdapter =
  createEntityAdapter<Task>({
    sortComparer: (
      firstTask,
      secondTask,
    ) =>
      secondTask.createdAt.localeCompare(
        firstTask.createdAt,
      ),
  });

const initialState =
  tasksAdapter.getInitialState<TasksAdditionalState>({
    status: 'idle',
    error: null,
    mutationError: null,
    createStatus: 'idle',
    updatingTaskIds: [],
    deletingTaskIds: [],
  });

export const fetchTasks = createAsyncThunk<
  Task[],
  void,
  {
    rejectValue: string;
  }
>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      return await mockApi.getTasks();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to load tasks.';

      return rejectWithValue(message);
    }
  },
);

export const createTask = createAsyncThunk<
  Task,
  CreateTaskInput,
  {
    rejectValue: string;
  }
>(
  'tasks/createTask',
  async (input, { rejectWithValue }) => {
    try {
      return await mockApi.createTask(input);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to create the task.';

      return rejectWithValue(message);
    }
  },
);

export const changeTaskStatus = createAsyncThunk<
  Task,
  ChangeTaskStatusInput,
  {
    rejectValue: string;
  }
>(
  'tasks/changeTaskStatus',
  async (
    {
      taskId,
      status,
    },
    {
      rejectWithValue,
    },
  ) => {
    try {
      return await mockApi.updateTaskStatus(
        taskId,
        status,
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to change the task status.';

      return rejectWithValue(message);
    }
  },
);

export const removeTask = createAsyncThunk<
  string,
  string,
  {
    rejectValue: string;
  }
>(
  'tasks/removeTask',
  async (taskId, { rejectWithValue }) => {
    try {
      return await mockApi.deleteTask(taskId);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to delete the task.';

      return rejectWithValue(message);
    }
  },
);

const removeIdFromArray = (
  ids: string[],
  taskId: string,
): string[] => {
  return ids.filter((id) => id !== taskId);
};

const tasksSlice = createSlice({
  name: 'tasks',

  initialState,

  reducers: {
    taskMutationErrorCleared: (state) => {
      state.mutationError = null;
    },

    taskCreateStatusReset: (state) => {
      state.createStatus = 'idle';
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })

      .addCase(
        fetchTasks.fulfilled,
        (state, action) => {
        state.status = 'succeeded';

        tasksAdapter.setAll(
          state,
          action.payload,
        );
      },
    )

      .addCase(
        fetchTasks.rejected,
        (state, action) => {
        state.status = 'failed';

        state.error =
          action.payload ??
          'An unexpected error occurred while loading tasks.';
      })

      .addCase(createTask.pending, (state) => {
        state.createStatus = 'loading';
        state.mutationError = null;
      })

      .addCase(
        createTask.fulfilled,
        (state, action) => {
        state.createStatus = 'succeeded';

        tasksAdapter.addOne(
          state,
          action.payload,
        );
      })

      .addCase(
        createTask.rejected,
        (state, action) => {
        state.createStatus = 'failed';

        state.mutationError =
          action.payload ??
          'An unexpected error occurred while creating the task.';
      })

      .addCase(
        changeTaskStatus.pending,
        (state, action) => {
        const taskId =
          action.meta.arg.taskId;

        state.mutationError = null;

        if (
          !state.updatingTaskIds.includes(
            taskId,
          )
        ) {
          state.updatingTaskIds.push(
            taskId,
          );
        }
      })

      .addCase(
        changeTaskStatus.fulfilled,
        (state, action) => {
        const taskId =
          action.meta.arg.taskId;

        tasksAdapter.upsertOne(
          state,
          action.payload,
        );

        state.updatingTaskIds =
          removeIdFromArray(
            state.updatingTaskIds,
            taskId,
          );
      })

      .addCase(
        changeTaskStatus.rejected,
        (state, action) => {
        const taskId =
          action.meta.arg.taskId;

        state.updatingTaskIds =
          removeIdFromArray(
            state.updatingTaskIds,
            taskId,
          );

        state.mutationError =
          action.payload ??
          'An unexpected error occurred while updating the task.';
      })

      .addCase(
        removeTask.pending,
        (state, action) => {
        const taskId = action.meta.arg;

        state.mutationError = null;

        if (
          !state.deletingTaskIds.includes(
            taskId,
          )
        ) {
          state.deletingTaskIds.push(
            taskId,
          );
        }
      })

      .addCase(
        removeTask.fulfilled,
        (state, action) => {
        const taskId = action.payload;

        tasksAdapter.removeOne(
          state,
          taskId,
        );

        state.deletingTaskIds =
          removeIdFromArray(
            state.deletingTaskIds,
            taskId,
          );
      })

      .addCase(
        removeTask.rejected,
        (state, action) => {
        const taskId = action.meta.arg;

        state.deletingTaskIds =
          removeIdFromArray(
            state.deletingTaskIds,
            taskId,
          );

        state.mutationError =
          action.payload ??
          'An unexpected error occurred while deleting the task.';
      });
  },
});

export const {
  taskMutationErrorCleared,
  taskCreateStatusReset,
} = tasksSlice.actions;

export const taskSelectors =
  tasksAdapter.getSelectors<RootState>(
    (state) => state.tasks,
  );

export const selectTasksStatus = (
  state: RootState,
): RequestStatus => {
  return state.tasks.status;
};

export const selectTasksError = (
  state: RootState,
): string | null => {
  return state.tasks.error;
};

export const selectTaskMutationError = (
  state: RootState,
): string | null => {
  return state.tasks.mutationError;
};

export const selectTaskCreateStatus = (
  state: RootState,
): RequestStatus => {
  return state.tasks.createStatus;
};

export const selectIsTaskUpdating = (
  state: RootState,
  taskId: string,
): boolean => {
  return state.tasks.updatingTaskIds.includes(
    taskId,
  );
};

export const selectIsTaskDeleting = (
  state: RootState,
  taskId: string,
): boolean => {
  return state.tasks.deletingTaskIds.includes(
    taskId,
  );
};

export const selectVisibleTasks =
  createSelector(
    [
      taskSelectors.selectAll,
      (state: RootState) =>
        state.projects.selectedProjectId,
    ],
    (
      tasks,
      selectedProjectId,
    ): Task[] => {
      if (!selectedProjectId) {
        return tasks;
      }

      return tasks.filter(
        (task) =>
          task.projectId ===
          selectedProjectId,
      );
    },
  );

export const selectVisibleTasksByStatus =
  createSelector(
    [
      selectVisibleTasks,
      (
        _state: RootState,
        status: TaskStatus,
      ) => status,
    ],
    (
      tasks,
      status,
    ): Task[] => {
      return tasks.filter(
        (task) =>
          task.status === status,
      );
    },
  );

export const selectTaskStatistics =
  createSelector(
    [selectVisibleTasks],
    (tasks) => {
      return {
        total: tasks.length,

        todo: tasks.filter(
          (task) =>
            task.status === 'todo',
        ).length,

        inProgress: tasks.filter(
          (task) =>
            task.status ===
            'in-progress',
        ).length,

        review: tasks.filter(
          (task) =>
            task.status === 'review',
        ).length,

        completed: tasks.filter(
          (task) =>
            task.status ===
            'completed',
        ).length,
      };
    },
  );

export default tasksSlice.reducer;