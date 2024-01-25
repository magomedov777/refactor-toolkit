import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AnyAction } from "redux";
export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed";

const initialState = {
  status: "idle" as RequestStatusType,
  error: null as string | null,
  isInitialized: false,
};

export type AppInitialStateType = typeof initialState;

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
      state.error = action.payload.error;
    },
    // setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
    //   state.status = action.payload.status;
    // },
    setAppInitialized: (state, action: PayloadAction<{ isInitialized: boolean }>) => {
      state.isInitialized = action.payload.isInitialized;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) => {
          return action.type.endsWith("/pending");
        },
        (state) => {
          state.status = "loading";
        }
      )
      .addMatcher(
        (action: AnyAction) => {
          return action.type.endsWith("/rejected");
        },

        (state, action) => {
          state.status = "failed";
          if (action.type.includes("addTodolist")) return;
          //@ts-ignore
          if (action.payload) {
            //@ts-ignore
            state.error = action.payload.messages[0];
          } else {
            //@ts-ignore
            state.error = action.error.message ? action.error.message : "Some error occured";
          }
        }
      )
      .addMatcher(
        (action) => {
          return action.type.endsWith("/fullfiled");
        },
        (state) => {
          state.status = "succeeded";
        }
      );
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;
