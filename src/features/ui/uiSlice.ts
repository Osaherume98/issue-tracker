import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';

export type WorkspaceView =
  | 'overview'
  | 'tasks'
  | 'team';

interface UiState {
  activeView: WorkspaceView;
}

const initialState: UiState = {
  activeView: 'overview',
};

const uiSlice = createSlice({
  name: 'ui',

  initialState,

  reducers: {
    activeViewChanged: (
      state,
      action: PayloadAction<WorkspaceView>,
    ) => {
      state.activeView = action.payload;
    },
  },
});

export const {
  activeViewChanged,
} = uiSlice.actions;

export const selectActiveView = (
  state: RootState,
): WorkspaceView => {
  return state.ui.activeView;
};

export default uiSlice.reducer;