/* eslint-disable @typescript-eslint/no-unused-vars */

import { AppDispatch, AppRootStateType, AppThunk } from "app/store";
import { appActions } from "app/app-reducer";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsActions, todolistsThunks } from "./todolists-reducer";
import { createAppAsyncThunk } from "utils/create-app-async-thunk";
import { ResultCode, TaskPriorities, TaskStatuses, handleServerAppError, handleServerNetworkError } from "utils";
import {
  AddTaskArgType,
  RemoveTaskType,
  TaskType,
  UpdateTaskArgType,
  UpdateTaskModelType,
  todolistsAPI,
} from "api/todolists-api";

const slice = createSlice({
  name: "tasks",
  initialState: {} as TasksStateType,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const tasks = state[action.payload.task.todoListId] as TaskType[];
        tasks.unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        let tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((tl) => tl.id === action.payload.taskId);
        if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.domainModel };
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        let tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((tl) => tl.id === action.payload.taskId);
        if (index !== -1) tasks.splice(index, 1);
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.id];
      })
      .addCase(todolistsThunks.fetchTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((tl) => (state[tl.id] = []));
      });
  },
});

const fetchTasks = createAppAsyncThunk<{ tasks: TaskType[]; todolistId: string }, string>(
  "tasks/fetchTasksTC",
  async (todolistId, thunkAPI) => {
    const { dispatch, rejectWithValue } = thunkAPI;
    try {
      dispatch(appActions.setAppStatus({ status: "loading" }));
      const res = await todolistsAPI.getTasks(todolistId);
      const tasks = res.data.items;
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { tasks, todolistId };
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

const addTask = createAppAsyncThunk<{ task: TaskType }, AddTaskArgType>("tasks/addTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.createTask(arg);
    if (res.data.resultCode === ResultCode.success) {
      const task = res.data.data.item;
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { task };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>(
  "task/updateTask",
  async (arg, thunkAPI) => {
    const { dispatch, rejectWithValue, getState } = thunkAPI;
    try {
      const state = getState();
      const task = state.tasks[arg.todolistId].find((t) => t.id === arg.taskId);
      if (!task) {
        dispatch(appActions.setAppError({ error: "task not found in the state" }));
        return rejectWithValue(null);
      }
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...arg.domainModel,
      };
      const res = await todolistsAPI.updateTask(arg.todolistId, arg.taskId, apiModel);
      if (res.data.resultCode === ResultCode.success) {
        return arg;
      } else {
        handleServerAppError(res.data, dispatch);
        return rejectWithValue(null);
      }
    } catch (err) {
      handleServerNetworkError(err, dispatch);
      return rejectWithValue(null);
    }
  }
);

const removeTask = createAppAsyncThunk<RemoveTaskType, RemoveTaskType>("tasks/removeTask", async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.deleteTask(arg.todolistId, arg.taskId);
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { taskId: arg.taskId, todolistId: arg.todolistId };
  } catch (err) {
    handleServerNetworkError(err, dispatch);
    return rejectWithValue(null);
  }
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };

// types
export type UpdateDomainTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};
export type TasksStateType = {
  [key: string]: Array<TaskType>;
};
