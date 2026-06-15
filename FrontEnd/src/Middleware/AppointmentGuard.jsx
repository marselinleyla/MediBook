/* ============================================================
 * AppointmentGuard.jsx – Route guard for the booking page.
 *
 * If the user is NOT authenticated and has no stored token,
 * it dispatches a "show alert" action and redirects to the
 * search page. Otherwise the child component renders.
 * ============================================================ */

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router";
import { get } from "../Services/LocalStorageService";
import { showAlertToAuth } from "../Redux/SliceAuthUser";

const AppointmentGuard = ({ children }) => {
  const dispatch = useDispatch();
  // AuthUserData – Redux state slice for the authenticated user
  const AuthUserData = useSelector((state) => state.authUser);

  if (!AuthUserData.isAuthenticated && !get("TOKEN_USER")) {
    // Not logged in – trigger the auth alert and redirect to search
    dispatch(showAlertToAuth(true));
    return <Navigate to="/recherche" replace />;
  } else {
    return children;
  }
};

export default AppointmentGuard;
