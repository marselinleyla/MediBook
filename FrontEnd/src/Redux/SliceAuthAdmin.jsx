/* ============================================================
 * SliceAuthAdmin.jsx – Redux slice for admin authentication.
 *
 * Manages the authentication state of an admin:
 *   - isAuthenticated – whether the admin is logged in
 *   - adminToken      – the JWT stored in localStorage
 *   - admin           – the admin profile object (or null)
 * ============================================================ */

import { createSlice } from "@reduxjs/toolkit";
import { get } from "../Services/LocalStorageService";

// Initialise auth state from the persisted token in localStorage
const initialState = {
  isAuthenticated: get("TOKEN_ADMIN") ? true : false,
  adminToken: get("TOKEN_ADMIN") || null,
  admin: null,
};

const AuthAdminSlice = createSlice({
  name: "authAdmin",
  initialState,
  reducers: {
    /** Called after successful registration – sets token, profile, and auth flag. */
    signUpSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
      state.adminToken = action.payload.token;
    },
    /** Store the admin profile fetched from the API (used by GetAuthAdmin hook). */
    addAdminData: (state, action) => {
      state.admin = action.payload;
    },
    /** Called after successful login – same as signUpSuccess. */
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.admin = action.payload.admin;
      state.adminToken = action.payload.token;
    },
    /** Clear all auth state on logout. */
    logout: (state) => {
      state.isAuthenticated = false;
      state.admin = null;
      state.adminToken = null;
    },
  },
});

export const {
  signUpSuccess,
  loginSuccess,
  logout,
  addAdminData,
} = AuthAdminSlice.actions;

export default AuthAdminSlice.reducer;
