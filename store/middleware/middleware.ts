import { clearAuthUser, storeAuthUser } from "../../components/auth/Auth";
/* types */
import type { Middleware } from "@reduxjs/toolkit"
import type { IStoreActions, ISignInAction } from "../../customTypes"

const logger: Middleware = store => next => (action: IStoreActions) => {
  console.group(action.type)
  console.info('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  console.groupEnd()
  return result
};


export const authStorageMiddleware: Middleware = store => next => (action: IStoreActions) => {
  if (action.type === "auth/authSignIn" && action.payload) {
    storeAuthUser(action["payload"]);
  }

  if (action.type === "auth/authSignOut") {
    clearAuthUser();
  }

  return next(action);
};
