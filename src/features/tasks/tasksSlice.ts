import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import {
  mockApi,
} from '../../services/mockApi';

import type {
  RootState,
} from '../../app/store';

import type {
  RequestStatus,
  Task,
  TaskStatus,
} from '../../types';


interface TasksState {
  status: RequestStatus;
  error: string | null;
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
  tasksAdapter.getInitialState<TasksState>({
    status: 'idle',
    error: null,
  });



export const fetchTasks =
  createAsyncThunk<
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
        return rejectWithValue(
          error instanceof Error
            ? error.message
            : 'Failed to load tasks',
        );
      }
    },
  );



export const changeTaskStatus =
  createAsyncThunk<
    Task,
    {
      taskId: string;
      status: TaskStatus;
    },
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
        return rejectWithValue(
          error instanceof Error
            ? error.message
            : 'Unable to update task',
        );
      }
    },
  );



export const removeTask =
  createAsyncThunk<
    string,
    string,
    {
      rejectValue: string;
    }
  >(
    'tasks/removeTask',
    async (
      taskId,
      {
        rejectWithValue,
      },
    ) => {
      try {
        return await mockApi.deleteTask(
          taskId,
        );
      } catch (error) {
        return rejectWithValue(
          error instanceof Error
            ? error.message
            : 'Unable to delete task',
        );
      }
    },
  );



const tasksSlice = createSlice({
  name: 'tasks',
  initialState,

  reducers: {},


  extraReducers: (
    builder,
  ) => {
    builder

      .addCase(
        fetchTasks.pending,
        (
          state,
        ) => {
          state.status = 'loading';
          state.error = null;
        },
      )

      .addCase(
        fetchTasks.fulfilled,
        (
          state,
          action,
        ) => {
          state.status = 'succeeded';

          tasksAdapter.setAll(
            state,
            action.payload,
          );
        },
      )


      .addCase(
        fetchTasks.rejected,
        (
          state,
          action,
        ) => {
          state.status = 'failed';

          state.error =
            action.payload ??
            'Something went wrong';
        },
      )



      .addCase(
        changeTaskStatus.fulfilled,
        (
          state,
          action,
        ) => {
          tasksAdapter.upsertOne(
            state,
            action.payload,
          );
        },
      )


      .addCase(
        removeTask.fulfilled,
        (
          state,
          action,
        ) => {
          tasksAdapter.removeOne(
            state,
            action.payload,
          );
        },
      );
  },
});



export const taskSelectors =
  tasksAdapter.getSelectors<RootState>(
    (
      state,
    ) =>
      state.tasks,
  );



export const selectTasksStatus =
(
  state: RootState,
): RequestStatus =>
{
  return state.tasks.status;
};



export const selectTasksError =
(
  state: RootState,
): string | null =>
{
  return state.tasks.error;
};



export const selectTasksByStatus =
(
  status: TaskStatus,
) =>
(
  state: RootState,
): Task[] =>
{
  return taskSelectors
    .selectAll(state)
    .filter(
      (
        task,
      ) =>
        task.status === status,
    );
};



export const selectTaskStatistics =
(
  state: RootState,
) => {

  const tasks =
    taskSelectors.selectAll(
      state,
    );


  return {
    total:
      tasks.length,

    todo:
      tasks.filter(
        task =>
          task.status === 'todo',
      ).length,

    inProgress:
      tasks.filter(
        task =>
          task.status === 'in-progress',
      ).length,

    review:
      tasks.filter(
        task =>
          task.status === 'review',
      ).length,

    completed:
      tasks.filter(
        task =>
          task.status === 'completed',
      ).length,
  };
};



export default tasksSlice.reducer;