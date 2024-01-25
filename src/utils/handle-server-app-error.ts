import { appActions } from "app/app-reducer";
import { ResponseType } from "api/types";
import { Dispatch } from "redux";

/**
@template D - The type of the response data.
@param {ResponseType<D>} data - The response data object.
@param {Dispatch} dispatch - The Redux dispatch function.
@param {boolean} [showError=true] - Indicates whether to show the error or not (default is true).
@returns {void}
*/

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch, showError: boolean = true) => {
  if (showError) {
    dispatch(appActions.setAppError({ error: data.messages.length ? data.messages[0] : "Some error occurred" }));
  }
  // dispatch(appActions.setAppStatus({ status: "failed" }));
};
