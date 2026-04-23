import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [
    {
      id: 1,
      title: "Transaction Successful",
      message: "₹5000 transferred successfully",
      time: "2 min ago",
      read: false,
    },
    {
      id: 2,
      title: "New Login Detected",
      message: "Login from new device",
      time: "10 min ago",
      read: false,
    },
    {
      id: 3,
      title: "Balance Update",
      message: "Your balance is updated",
      time: "1 hour ago",
      read: true,
    }, {
      id: 4,
      title: "Transaction Successful",
      message: "₹5000 transferred successfully",
      time: "2 min ago",
      read: false,
    },
    {
      id: 5,
      title: "New Login Detected",
      message: "Login from new device",
      time: "10 min ago",
      read: false,
    },
    {
      id: 6,
      title: "Balance Update",
      message: "Your balance is updated",
      time: "1 hour ago",
      read: true,
    },
     {
      id: 7,
      title: "Transaction Successful",
      message: "₹5000 transferred successfully",
      time: "2 min ago",
      read: false,
    },
    {
      id: 8,
      title: "New Login Detected",
      message: "Login from new device",
      time: "10 min ago",
      read: false,
    }
  ],
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) notif.read = true;
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => (n.read = true));
    },
  },
});

export const { markAsRead, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;