/* eslint-disable @typescript-eslint/no-unused-vars */
import { Dispatch } from "redux";
import { appActions, RequestStatusType } from "app/app-reducer";
import { AppThunk } from "app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createAppAsyncThunk, handleServerNetworkError } from "utils";
import { TodoArgType, todolistsAPI, TodolistType } from "api/todolists-api";
import { thunkTryCatch } from "utils/thunk-try-catch";

const slice = createSlice({
  name: "todolists",
  initialState: [] as TodolistDomainType[],
  reducers: {
    changeTodolistFilter: (
      state,
      action: PayloadAction<{ id: string; filter: FilterValuesType }>
    ) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index !== -1) state[index].filter = action.payload.filter;
    },
    changeTodolistEntityStatus: (
      state,
      action: PayloadAction<{ id: string; status: RequestStatusType }>
    ) => {
      const index = state.findIndex((tl) => tl.id === action.payload.id);
      if (index !== -1) state[index].entityStatus = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({
          ...tl,
          filter: "all",
          entityStatus: "idle",
        }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.id);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        state.unshift({
          ...action.payload.todolist,
          filter: "all",
          entityStatus: "idle",
        });
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const index = state.findIndex((tl) => tl.id === action.payload.arg.id);
        if (index !== -1) state[index].title = action.payload.arg.title;
      });
  },
});

const fetchTodolists = createAppAsyncThunk<
  { todolists: TodolistType[] },
  { todolists: TodolistType[] }
>("todolists/fetchTodolists", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await todolistsAPI.getTodolists();
    return { todolists: res.data };
  });
});

const removeTodolist = createAppAsyncThunk<{ id: string }, string>(
  "todolists/removeTodolist",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.deleteTodolist(todolistId);
      return { id: todolistId };
    });
  }
);

const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(
  "todolists/addTodolist",
  async (title: string, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.createTodolist(title);
      return { todolist: res.data.data.item };
    });
  }
);

const changeTodolistTitle = createAppAsyncThunk(
  "todolists/changeTodolistTitle",
  async (arg: TodoArgType, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    return thunkTryCatch(thunkAPI, async () => {
      const res = await todolistsAPI.updateTodolist(arg.id, arg.title);
      return { arg };
    });
  }
);

export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = {
  fetchTodolists,
  removeTodolist,
  addTodolist,
  changeTodolistTitle,
};
