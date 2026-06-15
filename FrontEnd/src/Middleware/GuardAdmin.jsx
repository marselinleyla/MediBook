/* ============================================================
 * GuardAdmin.jsx – Route guard for admin-protected pages.
 *
 * Redirects unauthenticated admins (or those without a stored
 * token) to the admin login page. Otherwise renders the child
 * component.
 * ============================================================ */

import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";
import { get } from "../Services/LocalStorageService";

const GuardAdmin = ({ children }) => {
  const AuthAdminData = useSelector((state) => state.AuthAdmin);

  // If not authenticated and no token exists → redirect to admin login
  if (!AuthAdminData.isAuthenticated && !get("TOKEN_ADMIN")) {
    console.log('from here');
    return <Navigate to="/admin/login" replace />;
  } else {
    return children;
  }
};
export default GuardAdmin;
