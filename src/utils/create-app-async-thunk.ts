import { createAsyncThunk } from "@reduxjs/toolkit";
import { ResponseType } from "api/types";
import { AppDispatch, AppRootStateType } from "app/store";

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: AppRootStateType;
  dispatch: AppDispatch;
  rejectValue: null | ResponseType;
}>();

// export type RejectValueType = {
//   data: ResponseType;
//   showGlobalError: boolean;
// };
