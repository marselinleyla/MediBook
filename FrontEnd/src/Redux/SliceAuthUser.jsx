/* ============================================================
 * SliceAuthUser.jsx – Redux slice for regular user authentication.
 *
 * Manages the authentication state of a regular user:
 *   - isAuthenticated  – whether the user is logged in
 *   - userToken        – the JWT stored in localStorage
 *   - showAlertToAuth  – boolean flag to show/hide an auth alert
 *   - user             – the user profile object (or null)
 * ============================================================ */

import { createSlice } from "@reduxjs/toolkit";
import { get } from "../Services/LocalStorageService";

// Initialise auth state from the persisted token in localStorage
const initialState = {
  isAuthenticated: get("TOKEN_USER") ? true : false,
  userToken: get("TOKEN_USER") || null,
  showAlertToAuth: false,
  user: null,
};

const AuthUserSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    /** Called after successful registration – sets token, profile, and clears alert. */
    signUpSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.userToken = action.payload.token;
      state.showAlertToAuth = false;
    },
    /** Toggle the "authentication required" alert. */
    showAlertToAuth: (state, action) => {
      state.showAlertToAuth = action.payload;
    },
    /** Store the user profile fetched from the API (used by GetAuthUser hook). */
    addUserData: (state, action) => {
      state.user = action.payload;
    },
    /** Called after successful login – same as signUpSuccess. */
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.userToken = action.payload.token;
      state.showAlertToAuth = false;
    },
    /** Clear all auth state on logout. */
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.userToken = null;
    },
  },
});

export const { signUpSuccess, loginSuccess, logout, addUserData , showAlertToAuth} =
  AuthUserSlice.actions;

export default AuthUserSlice.reducer;
