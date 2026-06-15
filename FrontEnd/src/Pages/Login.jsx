import React, { useEffect, useState } from "react";
import { AlertErrorMessage, AuthButton, Footer, Header } from "../Components";
import { useDispatch, useSelector } from "react-redux";
import { get, storeInLocalStorage } from "../Services/LocalStorageService";
import { useNavigate } from "react-router";
import axiosClient from "../AxiosClient";
import { loginSuccess } from "../Redux/SliceAuthUser";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/*
 * Login — Patient/User login page (public)
 * Provides email/password form for user authentication.
 * State:
 *   DataForm — { email, password } controlled form values
 *   loading — button spinner during API call
 *   error — server error message (422)
 * Redux: dispatches loginSuccess, stores token in localStorage
 * API:
 *   POST /user/login — authenticates user, returns user data + token
 * Redirects to /user/profile if already authenticated.
 */
const Login = () => {
  const { t } = useTranslation();
  document.title = t("auth.login_title", "Connexion | MediBook");

  const userData = useSelector((state) => state.authUser);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  /* Redirect if already logged in */
  useEffect(() => {
    if (userData.isAuthenticated && get("TOKEN_USER")) {
      navigate("/user/profile");
    }
  }, [navigate, userData.isAuthenticated]);

  const [DataForm, setDataForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  /* Updates form field value on user input */
  const HandleChangeData = (ev) => {
    const { name, value } = ev.target;
    setDataForm({ ...DataForm, [name]: value });
  };

  /* Submits login credentials; on success dispatches Redux action and stores token */
  const HandleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axiosClient
      .post("/user/login", DataForm)
      .then(({ data }) => {
        dispatch(loginSuccess(data));
        storeInLocalStorage("TOKEN_USER", data.token);
        setLoading(false);
        navigate("/user/profile");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          setError(err.response.data.error);
        } else {
          console.error(err);
        }
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[120px]" />
      </div>

      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 relative z-10 py-20">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="text-center mb-10">
                <Link to="/" className="inline-flex items-center space-x-2 mb-6">
                  <img src="/img/logo.png" className="h-15 w-auto" alt="Logo" />
                  
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  {t("auth.welcome_back", "Welcome Back")}
                </h1>
                <p className="text-slate-500 text-sm">
                  {t("auth.sign_in_access", "Sign in to access your healthcare dashboard.")}
                </p>
              </div>

              {error && <AlertErrorMessage message={error} />}

              <form className="space-y-6" onSubmit={HandleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
                  >
                    {t("auth.email")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      onChange={HandleChangeData}
                      className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl block w-full pl-11 pr-4 py-3 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                      placeholder={t("auth.email_placeholder", "name@company.com")}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label
                      htmlFor="password"
                      className="block text-xs font-bold text-slate-700 uppercase tracking-wider"
                    >
                      {t("auth.password")}
                    </label>
                    <Link to="/tets" className="text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors">
                      {t("auth.forgot_password", "Forgot Password?")}
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      required
                      onChange={HandleChangeData}
                      className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-2xl block w-full pl-11 pr-4 py-3 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none"
                      placeholder={t("auth.password_placeholder", "••••••••")}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <AuthButton Text={t("auth.sign_in", "Sign In")} Loading={loading} />
                </div>
              </form>

              <div className="mt-8 text-center sm:flex sm:justify-center sm:items-center sm:space-x-1">
                <span className="text-slate-500 text-sm">{t("auth.no_account")}</span>
                <Link to="/identifier" className="text-brand-600 font-bold text-sm hover:underline">
                  {t("auth.create_account", "Create an account")}
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link to="/doctor/login" className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
                  {t("auth.are_you_doctor", "Are you a Doctor? Login here")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;

