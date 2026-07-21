import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { mockApi } from '../../services/mockApi';

import type { RootState } from '../../app/store';
import type {
  Project,
  RequestStatus,
} from '../../types';

interface ProjectsAdditionalState {
  status: RequestStatus;
  error: string | null;
  selectedProjectId: string | null;
}

export const projectsAdapter =
  createEntityAdapter<Project>({
    sortComparer: (firstProject, secondProject) =>
      firstProject.name.localeCompare(secondProject.name),
  });

const initialState =
  projectsAdapter.getInitialState<ProjectsAdditionalState>({
    status: 'idle',
    error: null,
    selectedProjectId: null,
  });

export const fetchProjects = createAsyncThunk<
  Project[],
  void,
  {
    rejectValue: string;
  }
>(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      return await mockApi.getProjects();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to load projects.';

      return rejectWithValue(message);
    }
  },
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    projectSelected: (
      state,
      action: PayloadAction<string | null>,
    ) => {
      state.selectedProjectId = action.payload;
    },

    projectsErrorCleared: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchProjects.fulfilled,
        (state, action) => {
          state.status = 'succeeded';

          projectsAdapter.setAll(state, action.payload);

          if (
            !state.selectedProjectId &&
            action.payload.length > 0
          ) {
            state.selectedProjectId =
              action.payload[0].id;
          }
        },
      )
      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ??
          'An unexpected error occurred while loading projects.';
      });
  },
});

export const {
  projectSelected,
  projectsErrorCleared,
} = projectsSlice.actions;

export const projectsSelectors =
  projectsAdapter.getSelectors<RootState>(
    (state) => state.projects,
  );

export const selectProjectsStatus = (
  state: RootState,
): RequestStatus => {
  return state.projects.status;
};

export const selectProjectsError = (
  state: RootState,
): string | null => {
  return state.projects.error;
};

export const selectSelectedProjectId = (
  state: RootState,
): string | null => {
  return state.projects.selectedProjectId;
};

export const selectSelectedProject = (
  state: RootState,
): Project | undefined => {
  const selectedProjectId =
    state.projects.selectedProjectId;

  if (!selectedProjectId) {
    return undefined;
  }

  return state.projects.entities[selectedProjectId];
};

export default projectsSlice.reducer;