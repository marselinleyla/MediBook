/* ============================================================
 * SliceAuthDoctor.jsx – Redux slice for doctor authentication.
 *
 * Manages the authentication state of a doctor:
 *   - isAuthenticated – whether the doctor is logged in
 *   - doctorToken     – the JWT stored in localStorage
 *   - doctor           – the doctor profile object (or null)
 *   - showAlertToAuth  – boolean flag to show/hide an auth alert
 * ============================================================ */

import { createSlice } from "@reduxjs/toolkit";
import { get } from "../Services/LocalStorageService";

// Initialise auth state from the persisted token in localStorage
const initialState = {
  isAuthenticated: get("TOKEN_DOCTOR") ? true : false,
  doctorToken: get("TOKEN_DOCTOR") || null,
  doctor: null,
};

const AuthDoctorSlice = createSlice({
  name: "authdoctor",
  initialState,
  reducers: {
    /** Called after successful registration – sets token, profile, and auth flag. */
    signUpSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.doctor = action.payload.doctor;
      state.doctorToken = action.payload.token;
    },
    /** Toggle the "authentication required" alert. */
    showAlertToAuth: (state, action) => {
      state.showAlertToAuth = action.payload;
    },
    /** Store the doctor profile fetched from the API (used by GetAuthDoctor hook). */
    addDoctorData: (state, action) => {
      state.doctor = action.payload;
    },
    /** Called after successful login – same as signUpSuccess. */
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.doctor = action.payload.doctor;
      state.doctorToken = action.payload.token;
    },
    /** Clear all auth state on logout. */
    logout: (state) => {
      state.isAuthenticated = false;
      state.doctor = null;
      state.doctorToken = null;
    },
  },
});

export const { signUpSuccess, loginSuccess, logout, addDoctorData , showAlertToAuth} =
AuthDoctorSlice.actions;

export default AuthDoctorSlice.reducer;
