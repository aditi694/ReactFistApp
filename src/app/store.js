import { configureStore } from "@reduxjs/toolkit";
import authReducer        from "../features/authSlice.jsx";
import accountReducer     from "../features/accountSlice.jsx";
import transactionReducer from "../features/transactionSlice.jsx";

export const store = configureStore({
    reducer: {
        auth:        authReducer,
        account:     accountReducer,
        transaction: transactionReducer,
    },
});