/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch } from "redux";
import { appActions, RequestStatusType } from "app/app-reducer";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerNetworkError } from "utils";
import { TodoArgType, todolistsAPI, TodolistType } from "api/todolists-api";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    // removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
    //   const index = state.findIndex((tl) => tl.id === action.payload.id);
    //   if (index !== -1) state.splice(index, 1);
    // },
    // addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
    //   state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
    // },
    // changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
    //   const index = state.findIndex((tl) => tl.id === action.payload.id);
    //   if (index !== -1) state[index].title = action.payload.title;
    // },
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; status: RequestStatusType }>) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index !== -1) state[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({ ...action.payload.todolist, filter: "all", entityStatus: "idle" });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.arg.id);
        if (index !== -1) state[index].title = action.payload.arg.title;
      });
  },
});

const fetchTodolists = createAppAsyncThunk<{ todolists: TodolistType[] }, { todolists: TodolistType[] }>(
  "todolists/fetchTodolists",
  async (_, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTodolists();
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolists: res.data };
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
  "todolists/removeTodolist",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      dispatch(todolistsActions.changeTodolistEntityStatus({ id: todolistId, status: "loading" }));
      const res = await todolistsAPI.deleteTodolist(todolistId);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { id: todolistId };
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todolists/addTodolist",
  async (title: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.createTodolist(title);
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolist: res.data.data.item };
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

const changeTodolistTitle = createAppAsyncThunk("todolists/changeTodolistTitle", async (arg: TodoArgType, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await todolistsAPI.updateTodolist(arg.id, arg.title);
    return { arg };
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};
// type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>;

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { fetchTodolists, removeTodolist, addTodolist, changeTodolistTitle };
