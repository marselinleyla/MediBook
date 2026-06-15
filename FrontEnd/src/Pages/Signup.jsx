import React, { useEffect, useState } from "react";
import { Footer, Header, AuthButton } from "../Components";
import axiosClient from "../AxiosClient.js";
import { useDispatch, useSelector } from "react-redux";
import { signUpSuccess } from "../Redux/SliceAuthUser";
import { get, storeInLocalStorage } from "../Services/LocalStorageService";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/*
 * Signup — Patient/User registration page (public)
 * Multi-field registration form (first name, last name, CIN, phone, email, password, confirm).
 * State:
 *   DataForm — all registration field values
 *   error — per-field validation errors (from 422 response)
 *   loading — submit button spinner
 * Redux: dispatches signUpSuccess, stores token in localStorage
 * API:
 *   POST /user/register — creates account, returns user data + token
 * Redirects to /user/profile if already authenticated.
 */
const Signup = () => {
  const { t } = useTranslation();
  document.title = t("auth.signup_title", "S'identifier | MediBook");

  const userData = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /* Redirect if already logged in */
  useEffect(() => {
    if (userData.isAuthenticated && get("TOKEN_USER")) {
      navigate("/user/profile");
    }
  }, [navigate, userData.isAuthenticated]);

  /* Form data state — maps 1:1 to API fields */
  const [DataForm, setData] = useState({
    firstname: "",
    lastname: "",
    cin: "",
    phoneNumber: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  /* Per-field validation error messages */
  const [error, setError] = useState({
    firstname: "",
    lastname: "",
    cin: "",
    phoneNumber: "",
    email: "",
    password: "",
  });

  /* Updates a single form field on input change */
  const HandleChangeData = (e) => {
    const { name, value } = e.target;
    setData({ ...DataForm, [name]: value });
  };

  /* Submits registration; on success dispatches Redux action and stores token */
  const HandleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();

    axiosClient
      .post("/user/register", DataForm)
      .then(({ data }) => {
        dispatch(signUpSuccess(data));
        storeInLocalStorage("TOKEN_USER", data.token);
        setLoading(false);
        navigate("/user/profile");
      })
      .catch((er) => {
        setLoading(false);
        if (er.response && er.response.status === 422) {
          setError({ ...error, ...er.response.data.errors });
        } else {
          console.error(er);
        }
      });
  };

  /* Returns Tailwind class string for input fields; adds error styling if errorField is truthy */
  const inputClasses = (errorField) => 
    `bg-slate-50 border ${errorField ? "border-rose-500 ring-1 ring-rose-500" : "border-slate-200"} text-slate-900 text-sm rounded-2xl block w-full px-4 py-3 focus:ring-brand-500 focus:border-brand-500 transition-all outline-none`;

  const labelClasses = "block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[120px]" />
      </div>

      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 relative z-10 py-24">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-premium border border-slate-100 overflow-hidden">
            <div className="p-8 sm:p-10">
              <div className="text-center mb-10">
                <Link to="/" className="inline-flex items-center space-x-2 mb-6">
                  <img src="/img/logo.png" className="h-13 w-auto" alt="Logo" />
                 
                </Link>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  {t("auth.create_profile", "Create your profile")}
                </h1>
                <p className="text-slate-500 text-sm">
                  {t("auth.join_community", "Join our medical community and get your appointment today.")}
                </p>
              </div>

              <form className="space-y-5" onSubmit={HandleSubmit}>
                {/* Name row: first name + last name in a 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="FirstName" className={labelClasses}>{t("auth.first_name", "First Name")}</label>
                    <input
                      type="text"
                      id="FirstName"
                      name="firstname"
                      placeholder={t("auth.first_name_placeholder", "John")}
                      required
                      onChange={HandleChangeData}
                      className={inputClasses(error.firstname)}
                    />
                    {error.firstname && (
                      <p className="mt-1.5 text-[11px] font-medium text-rose-600 ml-1">{error.firstname[0]}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="LastName" className={labelClasses}>{t("auth.last_name", "Last Name")}</label>
                    <input
                      type="text"
                      id="LastName"
                      name="lastname"
                      placeholder={t("auth.last_name_placeholder", "Doe")}
                      required
                      onChange={HandleChangeData}
                      className={inputClasses(error.lastname)}
                    />
                    {error.lastname && (
                      <p className="mt-1.5 text-[11px] font-medium text-rose-600 ml-1">{error.lastname[0]}</p>
                    )}
                  </div>
                </div>

                {/* CIN (national ID) field */}
                <div>
                  <label htmlFor="cin" className={labelClasses}>{t("auth.id_number", "ID Number (CIN)")}</label>
                  <input
                    type="text"
                    id="cin"
                    name="cin"
                    placeholder={t("auth.id_placeholder", "E.g. AE12345")}
                    required
                    onChange={HandleChangeData}
                    className={inputClasses(error.cin)}
                  />
                  {error.cin && (
                    <p className="mt-1.5 text-[11px] font-medium text-rose-600 ml-1">{error.cin[0]}</p>
                  )}
                </div>

                {/* Phone number field */}
                <div>
                  <label htmlFor="phoneNumber" className={labelClasses}> {t("auth.phone_number", "Phone Number")}</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder={t("auth.phone_placeholder", "+212 6XXXXXXXX")}
                    required
                    onChange={HandleChangeData}
                    className={inputClasses(error.phoneNumber)}
                  />
                  {error.phoneNumber && (
                    <p className="mt-1.5 text-[11px] font-medium text-rose-600 ml-1">{error.phoneNumber[0]}</p>
                  )}
                </div>

                {/* Email address field */}
                <div>
                  <label htmlFor="email" className={labelClasses}>{t("auth.email")}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={t("auth.email_placeholder_signup", "john@example.com")}
                    required
                    onChange={HandleChangeData}
                    className={inputClasses(error.email)}
                  />
                  {error.email && (
                    <p className="mt-1.5 text-[11px] font-medium text-rose-600 ml-1">{error.email[0]}</p>
                  )}
                </div>

                {/* Password row: password + confirm password in 2-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="Password" className={labelClasses}>{t("auth.password")}</label>
                    <input
                      type="password"
                      id="Password"
                      name="password"
                      placeholder={t("auth.password_placeholder", "••••••••")}
                      required
                      onChange={HandleChangeData}
                      className={inputClasses(error.password)}
                    />
                    {error.password && (
                      <p className="mt-1.5 text-[11px] font-medium text-rose-600 ml-1">{error.password[0]}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="PasswordConfirmation" className={labelClasses}>{t("auth.confirm_password")}</label>
                    <input
                      type="password"
                      id="PasswordConfirmation"
                      name="password_confirmation"
                      placeholder={t("auth.password_placeholder", "••••••••")}
                      required
                      onChange={HandleChangeData}
                      className={inputClasses(false)}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <AuthButton Text={t("auth.create_profile", "Create Profile")} Loading={loading} />
                </div>
              </form>

              <div className="mt-8 text-center sm:flex sm:justify-center sm:items-center sm:space-x-1">
                <span className="text-slate-500 text-sm">{t("auth.have_account")}</span>
                <Link to="/Connexion" className="text-brand-600 font-bold text-sm hover:underline">
                  {t("auth.sign_in", "Sign in")}
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link to="/doctor/signup" className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest">
                  {t("auth.are_you_doctor_join", "Are you a Doctor? Join our network")}
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

export default Signup;

