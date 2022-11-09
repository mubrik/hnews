import { createSlice } from '@reduxjs/toolkit';
import { getAuthUser } from '../components/auth/Auth';
/* types */
import { IAuthStoreState, ISignInAction, ISignOutAction } from '../customTypes';
import type { RootState } from '../App';

/* gets the initail state for the auth slice */
const getAuthInit = (): IAuthStoreState => {

  let initState: IAuthStoreState = {
    isAuthenticated: false,
    userId: null,
    username: null,
    email: null
  }

  /* try getting authenticated user from storage */
  getAuthUser()
    .then(userObj => {
      if (userObj) {
        initState =  {
          ...userObj,
          isAuthenticated: true
        }
      }
    })
    .catch(err => initState);

  return initState;
}


const authSlice = createSlice({
  name: 'auth',
  initialState: getAuthInit,
  reducers: {
    authSignIn(state, action: ISignInAction) {
      return {
        ...state,
        isAuthenticated: true,
        userId: action.payload.userId,
        username: action.payload.username,
        email: action.payload.email,
      }
    },
    authSignOut(state, action: ISignOutAction) {
      return {
        ...state,
        isAuthenticated: false,
        userId: null,
        username: null,
        email: null,
      }
    }
  }
})

export const { authSignIn, authSignOut } = authSlice.actions;
export const selectIsAuth = (state:RootState) => state.auth.isAuthenticated;
export default authSlice.reducer;