import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import { mockApi } from '../../services/mockApi';

import type { RootState } from '../../app/store';
import type {
  Employee,
  RequestStatus,
} from '../../types';

interface EmployeesAdditionalState {
  status: RequestStatus;
  error: string | null;
}

export const employeesAdapter =
  createEntityAdapter<Employee>({
    sortComparer: (firstEmployee, secondEmployee) =>
      firstEmployee.name.localeCompare(
        secondEmployee.name,
      ),
  });

const initialState =
  employeesAdapter.getInitialState<EmployeesAdditionalState>({
    status: 'idle',
    error: null,
  });

export const fetchEmployees = createAsyncThunk<
  Employee[],
  void,
  {
    rejectValue: string;
  }
>(
  'employees/fetchEmployees',
  async (_, { rejectWithValue }) => {
    try {
      return await mockApi.getEmployees();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to load employees.';

      return rejectWithValue(message);
    }
  },
);

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        fetchEmployees.fulfilled,
        (state, action) => {
          state.status = 'succeeded';

          employeesAdapter.setAll(
            state,
            action.payload,
          );
        },
      )
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload ??
          'An unexpected error occurred while loading employees.';
      });
  },
});

export const employeesSelectors =
  employeesAdapter.getSelectors<RootState>(
    (state) => state.employees,
  );

export const selectEmployeesStatus = (
  state: RootState,
): RequestStatus => {
  return state.employees.status;
};

export const selectEmployeesError = (
  state: RootState,
): string | null => {
  return state.employees.error;
};

export default employeesSlice.reducer;