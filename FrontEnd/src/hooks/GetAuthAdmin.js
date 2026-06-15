/* ============================================================
 * GetAuthAdmin.js – Custom hook that fetches the authenticated
 * admin's profile from the API and saves it to Redux.
 *
 * Runs once when the component mounts (or when the dependency
 * array changes) if the admin is authenticated in Redux, has a
 * stored token, but the admin data hasn't been loaded yet.
 * ============================================================ */

import  { useEffect } from "react";
import { addAdminData } from "../Redux/SliceAuthAdmin";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { get, remove } from "../Services/LocalStorageService";
import axiosClient from "../AxiosClient";

const GetAuthAdmin = () => {
  const dispatch = useDispatch();

  // adminData – the current admin auth state from Redux (SliceAuthAdmin)
  const adminData = useSelector((state) => state.AuthAdmin);

  const navigate = useNavigate();

  useEffect(() => {
    // Only fetch if the admin is flagged as authenticated, a token exists,
    // but the admin profile hasn't been loaded yet (admin is null).
    if (adminData.isAuthenticated && get("TOKEN_ADMIN") && !adminData.admin) {
      axiosClient
        .get("/admin")
        .then((re) => {
          // Store the fetched admin profile in Redux
          dispatch(addAdminData(re.data));
          console.log(re);
        })
        .catch((er) => {
          console.log(er);
          // Token is invalid/expired – remove it and redirect to login
          remove("TOKEN_ADMIN")
          navigate("/admin/login");
        });
    }
    console.log(adminData);
  }, [dispatch, navigate , adminData]);
};

export default GetAuthAdmin;
