import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type {
  RootState,
} from '../../app/store';

import type {
  TaskPriority,
} from '../../types';

export type PriorityFilter =
  | TaskPriority
  | 'all';

interface FiltersState {
  searchTerm: string;
  employeeId: string;
  priority: PriorityFilter;
  overdueOnly: boolean;
}

const initialState: FiltersState = {
  searchTerm: '',
  employeeId: 'all',
  priority: 'all',
  overdueOnly: false,
};

const filtersSlice = createSlice({
  name: 'filters',

  initialState,

  reducers: {
    searchTermChanged: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.searchTerm = action.payload;
    },

    employeeFilterChanged: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.employeeId = action.payload;
    },

    priorityFilterChanged: (
      state,
      action: PayloadAction<PriorityFilter>,
    ) => {
      state.priority = action.payload;
    },

    overdueFilterChanged: (
      state,
      action: PayloadAction<boolean>,
    ) => {
      state.overdueOnly = action.payload;
    },

    filtersCleared: (state) => {
      state.searchTerm = '';
      state.employeeId = 'all';
      state.priority = 'all';
      state.overdueOnly = false;
    },
  },
});

export const {
  searchTermChanged,
  employeeFilterChanged,
  priorityFilterChanged,
  overdueFilterChanged,
  filtersCleared,
} = filtersSlice.actions;

export const selectSearchTerm = (
  state: RootState,
): string => {
  return state.filters.searchTerm;
};

export const selectEmployeeFilter = (
  state: RootState,
): string => {
  return state.filters.employeeId;
};

export const selectPriorityFilter = (
  state: RootState,
): PriorityFilter => {
  return state.filters.priority;
};

export const selectOverdueOnly = (
  state: RootState,
): boolean => {
  return state.filters.overdueOnly;
};

export const selectHasActiveFilters = (
  state: RootState,
): boolean => {
  return (
    state.filters.searchTerm.trim() !== '' ||
    state.filters.employeeId !== 'all' ||
    state.filters.priority !== 'all' ||
    state.filters.overdueOnly
  );
};

export default filtersSlice.reducer;