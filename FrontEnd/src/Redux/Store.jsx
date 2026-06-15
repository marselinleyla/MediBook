/* ============================================================
 * Store.jsx – Redux store configuration.
 *
 * Combines the three auth slices (user, doctor, admin) into a
 * single store using configureStore from Redux Toolkit.
 * ============================================================ */

import { configureStore } from "@reduxjs/toolkit";
import SliceAuthUser from "./SliceAuthUser";
import AuthDoctorSlice from "./SliceAuthDoctor";
import SliceAuthAdmin from "./SliceAuthAdmin";

const store = configureStore({
  reducer: {
    authUser: SliceAuthUser,   // Regular user authentication state
    AuthDoctor: AuthDoctorSlice, // Doctor authentication state
    AuthAdmin: SliceAuthAdmin,   // Admin authentication state
  },
});

export default store;
