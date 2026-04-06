import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTransactions } from "../api/transactionApi";

export const fetchTransactions = createAsyncThunk(
    "transaction/fetchTransactions",
    async (accountNumber, thunkAPI) => {
        try {
            const res = await getTransactions(accountNumber);

            if (res?.error) {
                return thunkAPI.rejectWithValue(res.message || "Failed to fetch transactions");
            }

            return res.data?.transactions || [];
        } catch (err) {
            return thunkAPI.rejectWithValue(err?.message || "Failed to fetch transactions");
        }
    }
);

const transactionSlice = createSlice({
    name: "transaction",
    initialState: {
        transactions: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearTransactions: (state) => {
            state.transactions = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                state.transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;