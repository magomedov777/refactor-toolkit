import { createSlice } from "@reduxjs/toolkit";
import { appActions } from "app/app-reducer";
import { ResultCode, createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "utils";
import { LoginParamsType, authAPI } from "./auth-api";

const slice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>("auth/login", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await authAPI.login(arg);
    if (res.data.resultCode === ResultCode.success) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: true };
    } else {
      handleServerAppError(res.data, dispatch, false);
      return rejectWithValue(res.data);
    }
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/logout", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.logout();
    if (res.data.resultCode === ResultCode.success) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { isLoggedIn: false };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  }
});

const initializeApp = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("app/initializeApp", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authAPI.me();
    if (res.data.resultCode === ResultCode.success) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue(null);
    }
  } catch (e: any) {
    handleServerNetworkError(e, dispatch);
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setAppInitialized({ isInitialized: true }));
  }
});

export const authReducer = slice.reducer;
export const authActions = slice.actions;
export const authThunks = { login, logout, initializeApp };
