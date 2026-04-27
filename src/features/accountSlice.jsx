import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCustomerDashboard } from "../api/customerApi";
import { getAnalytics } from "../api/transactionApi";
import { getTransactions } from "../api/transactionApi";

export const fetchDashboard = createAsyncThunk(
    "account/fetchDashboard",
    async (_, thunkAPI) => {
        try {
            const dashRes = await getCustomerDashboard();

            if (dashRes?.error || !dashRes?.data) {
                return thunkAPI.rejectWithValue(
                    dashRes?.message || "Failed to load dashboard"
                );
            }

            const dashData = dashRes.data;
            const accountNumber = dashData?.accountNumber;

            let analytics = null;
            let recentTransactions = [];

            if (accountNumber) {
                const now = new Date();
                const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

                const [analyticsRes, txnRes] = await Promise.allSettled([
                    getAnalytics(accountNumber, month),
                    getTransactions(accountNumber)
                ]);

                if (analyticsRes.status === "fulfilled" && !analyticsRes.value?.error) {
                    analytics = analyticsRes.value.data;
                }

                if (txnRes.status === "fulfilled" && !txnRes.value?.error) {
                    recentTransactions = (txnRes.value.data?.transactions || []).slice(0, 4);
                }
            }
            return {
                ...dashData,
                analytics,
                recentTransactions,
            };

        } catch (err) {
            return thunkAPI.rejectWithValue(err?.message || "Failed to load dashboard");
        }
    }
);

const accountSlice = createSlice({
    name: "account",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearDashboard: (state) => {
            state.data = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Error loading dashboard";
            });
    },
});

export const { clearDashboard } = accountSlice.actions;
export default accountSlice.reducer;