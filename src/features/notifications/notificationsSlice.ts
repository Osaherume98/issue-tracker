import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import type { RootState } from '../../app/store';

export type NotificationType =
  | 'success'
  | 'error'
  | 'info';

export interface AppNotification {
  id: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  items: AppNotification[];
  panelOpen: boolean;
}

interface AddNotificationPayload {
  message: string;
  type: NotificationType;
}

const initialState: NotificationsState = {
  items: [],
  panelOpen: false,
};

const generateNotificationId = (): string => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `notification-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
};

const notificationsSlice = createSlice({
  name: 'notifications',

  initialState,

  reducers: {
    notificationAdded: (
      state,
      action: PayloadAction<AddNotificationPayload>,
    ) => {
      const notification: AppNotification = {
        id: generateNotificationId(),
        message: action.payload.message,
        type: action.payload.type,
        read: false,
        createdAt: new Date().toISOString(),
      };

      state.items.unshift(notification);

      if (state.items.length > 20) {
        state.items = state.items.slice(0, 20);
      }
    },

    notificationRead: (
      state,
      action: PayloadAction<string>,
    ) => {
      const notification = state.items.find(
        (item) => item.id === action.payload,
      );

      if (notification) {
        notification.read = true;
      }
    },

    allNotificationsRead: (state) => {
      state.items.forEach((notification) => {
        notification.read = true;
      });
    },

    notificationRemoved: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.items = state.items.filter(
        (notification) =>
          notification.id !== action.payload,
      );
    },

    notificationsCleared: (state) => {
      state.items = [];
    },

    notificationPanelOpened: (state) => {
      state.panelOpen = true;
    },

    notificationPanelClosed: (state) => {
      state.panelOpen = false;
    },

    notificationPanelToggled: (state) => {
      state.panelOpen = !state.panelOpen;
    },
  },
});

export const {
  notificationAdded,
  notificationRead,
  allNotificationsRead,
  notificationRemoved,
  notificationsCleared,
  notificationPanelOpened,
  notificationPanelClosed,
  notificationPanelToggled,
} = notificationsSlice.actions;

export const selectNotifications = (
  state: RootState,
): AppNotification[] => {
  return state.notifications.items;
};

export const selectUnreadNotificationCount = (
  state: RootState,
): number => {
  return state.notifications.items.filter(
    (notification) => !notification.read,
  ).length;
};

export const selectNotificationPanelOpen = (
  state: RootState,
): boolean => {
  return state.notifications.panelOpen;
};

export default notificationsSlice.reducer;