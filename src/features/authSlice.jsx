import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { customerLogin, adminLogin } from "../api/authApi";
import { setToken, getUserFromToken } from "../utils/auth";

// ─── Customer Login ──────────────────────────────────────────────
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, thunkAPI) => {
        try {
            const res = await customerLogin(
                formData.accountNumber,
                formData.password
            );

            if (res?.error || !res?.data?.token) {
                return thunkAPI.rejectWithValue(
                    res?.message || "Invalid credentials"
                );
            }

            setToken(res.data.token);
            return getUserFromToken();

        } catch {
            return thunkAPI.rejectWithValue("Invalid credentials");
        }
    }
);

// ─── Admin Login ─────────────────────────────────────────────────
export const adminLoginThunk = createAsyncThunk(
    "auth/adminLogin",
    async (formData, thunkAPI) => {
        try {
            const res = await adminLogin(formData.username, formData.password);

            if (res?.error || !res?.data?.token) {
                return thunkAPI.rejectWithValue(
                    res?.message || "Invalid credentials"
                );
            }

            setToken(res.data.token);
            return getUserFromToken();

        } catch {
            return thunkAPI.rejectWithValue("Invalid credentials");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user:            getUserFromToken(),
        loading:         false,
        error:           null,
        isAuthenticated: !!localStorage.getItem("token"),
    },
    reducers: {
        logout: (state) => {
            localStorage.clear();
            sessionStorage.clear();
            state.user            = null;
            state.isAuthenticated = false;
            state.error           = null;
        },
    },
    extraReducers: (builder) => {
        // ── loginUser (customer) ─────────────────────────────────
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading         = false;
                state.user            = action.payload;
                state.isAuthenticated = true;
                state.error           = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload || "Login failed";
            });

        // ── adminLoginThunk ──────────────────────────────────────
        builder
            .addCase(adminLoginThunk.pending, (state) => {
                state.loading = true;
                state.error   = null;
            })
            .addCase(adminLoginThunk.fulfilled, (state, action) => {
                state.loading         = false;
                state.user            = action.payload;
                state.isAuthenticated = true;
                state.error           = null;
            })
            .addCase(adminLoginThunk.rejected, (state, action) => {
                state.loading = false;
                state.error   = action.payload || "Login failed";
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;