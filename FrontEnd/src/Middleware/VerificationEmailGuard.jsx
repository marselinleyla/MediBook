/* ============================================================
 * VerificationEmailGuard.jsx – Route guard for the user
 * email-verification page.
 *
 * If the user's email is already verified, they are redirected
 * to their profile. Otherwise the child component (the
 * verification form) renders. Also fetches the user profile
 * if it hasn't been loaded yet.
 * ============================================================ */

import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import axiosClient from "../AxiosClient";
import { addUserData } from "../Redux/SliceAuthUser";
import { get, remove } from "../Services/LocalStorageService";

const VerificationEmailGuard = ({ children }) => {
  const UserData = useSelector((state) => state.authUser);
  const navigate = useNavigate();
  const dispatch=useDispatch()

  useEffect(() => {
    // Fetch user profile if authenticated, token exists, but not yet loaded
    if (
      UserData.isAuthenticated &&
      get("TOKEN_USER") &&
      UserData.user === null
    ) {
      axiosClient
        .get("/user")
        .then((re) => {
          dispatch(addUserData(re.data));
        })
        .catch((er) => {
          remove("TOKEN_USER")
          navigate("/Connexion");
        });
    }
  }, [dispatch, navigate, UserData.isAuthenticated, UserData.user]);

  if (UserData.user) {
    if (UserData.user.email_verified_at) {
      // Email already verified – redirect to profile
      return navigate("/user/profile");
    } else {
      // Email not yet verified – show verification form
      return children;
    }
  }
};

export default VerificationEmailGuard;
