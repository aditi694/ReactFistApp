import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },

    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
    },

    markAsRead: (state, action) => {
      const notif = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notif) notif.status = "READ";
    },

    markAllAsRead: (state) => {
      state.notifications.forEach((n) => (n.status = "READ"));
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;