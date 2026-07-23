import type {
  Task,
  TaskPriority,
} from '../types';

import type {
  AppNotification,
} from '../features/notifications/notificationsSlice';

const STORAGE_KEY =
  'teamflow-workspace-state';

const STORAGE_VERSION = 1;

export interface PersistedFilters {
  searchTerm: string;
  employeeId: string;
  priority: TaskPriority | 'all';
  overdueOnly: boolean;
}

export interface PersistedWorkspaceState {
  version: number;
  selectedProjectId: string | null;
  tasks: Task[];
  filters: PersistedFilters;
  notifications: AppNotification[];
}

const isRecord = (
  value: unknown,
): value is Record<string, unknown> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
};

const isValidPersistedState = (
  value: unknown,
): value is PersistedWorkspaceState => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === STORAGE_VERSION &&
    Array.isArray(value.tasks) &&
    Array.isArray(value.notifications) &&
    isRecord(value.filters) &&
    (
      typeof value.selectedProjectId ===
        'string' ||
      value.selectedProjectId === null
    )
  );
};

export const loadPersistedWorkspace =
  (): PersistedWorkspaceState | null => {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const serialisedState =
        window.localStorage.getItem(
          STORAGE_KEY,
        );

      if (!serialisedState) {
        return null;
      }

      const parsedState: unknown =
        JSON.parse(serialisedState);

      if (!isValidPersistedState(parsedState)) {
        window.localStorage.removeItem(
          STORAGE_KEY,
        );

        return null;
      }

      return parsedState;
    } catch (error) {
      console.error(
        'Unable to load persisted workspace:',
        error,
      );

      return null;
    }
  };

export const savePersistedWorkspace = (
  state: Omit<
    PersistedWorkspaceState,
    'version'
  >,
): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const persistedState:
      PersistedWorkspaceState = {
        version: STORAGE_VERSION,
        ...state,
      };

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(persistedState),
    );
  } catch (error) {
    console.error(
      'Unable to save workspace:',
      error,
    );
  }
};

export const clearPersistedWorkspace =
  (): void => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(
        STORAGE_KEY,
      );
    } catch (error) {
      console.error(
        'Unable to clear persisted workspace:',
        error,
      );
    }
  };