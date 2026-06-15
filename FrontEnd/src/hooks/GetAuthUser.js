/* ============================================================
 * GetAuthUser.js – Custom hook that fetches the authenticated
 * regular user's profile from the API and saves it to Redux.
 *
 * Runs when the component mounts (or dependencies change) if
 * the user is authenticated in Redux, has a stored token, but
 * the user profile hasn't been loaded yet.
 * ============================================================ */

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "../Redux/SliceAuthUser";
import { get, remove } from "../Services/LocalStorageService";
import { useNavigate } from "react-router";
import axiosClient from "../AxiosClient";

const GetAuthUser = () => {
  const dispatch = useDispatch();

  // UserData – the current user auth state from Redux (SliceAuthUser)
  const UserData = useSelector((state) => state.authUser);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile only when authenticated, token exists,
    // but user data hasn't been populated yet.
    if (
      UserData.isAuthenticated &&
      get("TOKEN_USER") &&
      UserData.user === null
    ) {
      axiosClient
        .get("/user")
        .then((re) => {
          // Store the fetched user profile in Redux
          dispatch(addUserData(re.data));
        })
        .catch((er) => {
          // Token is invalid/expired – remove it and redirect to login
          remove("TOKEN_USER")
          navigate("/Connexion");
        });
    }
  }, [dispatch, navigate, UserData.isAuthenticated, UserData.user]);

  console.log(UserData);
  console.log( "get authu ud" );
};

export default GetAuthUser;
