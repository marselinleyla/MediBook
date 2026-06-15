import React, { useEffect, useState } from "react";
import { Footer, Header, UserNavSettings } from "../../Components";
import { useSelector } from "react-redux";
import axiosClient from "../../AxiosClient";
import GetAuthUser from "../../hooks/GetAuthUser";
import { 
  UserIcon, 
  EnvelopeIcon, 
  IdentificationIcon, 
  PhoneIcon,
  CloudArrowUpIcon, 
  ExclamationTriangleIcon,
  TrashIcon,
  UserCircleIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * User Settings — Authenticated user's profile editing page
 * Allows updating first name, last name, phone number, and avatar image.
 * State:
 *   DataForm — form fields pre-populated from Redux user data
 *   UserAvatar / previewAvatar — file upload state for avatar
 *   GetUserAvatar — current avatar filename from backend
 *   loading — submit button spinner
 *   success — success indicator (brief, then page reload)
 * API:
 *   POST /user/update (with _method=PUT) — multipart form data update
 * Auth: GetAuthUser() guards the route
 */
const Settings = () => {
  const { t } = useTranslation();
  const UserData = useSelector((state) => state.authUser);
  const [UserAvatar, setUserAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [GetUserAvatar, setGetUserAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [DataForm, setDataForm] = useState({
    id: 0,
    firstname: "",
    lastname: "",
    email: "",
    cin: "",
    phoneNumber: "",
  });

  GetAuthUser();

  /* Populate form fields and avatar from Redux user data on mount */
  useEffect(() => {
    if (UserData.user && UserData.user.user_avatar !== null) {
      setGetUserAvatar(UserData.user.user_avatar);
    }

    if (UserData.user) {
      setDataForm({
        id: UserData.user.id,
        firstname: UserData.user.firstname,
        lastname: UserData.user.lastname,
        email: UserData.user.email,
        cin: UserData.user.cin,
        phoneNumber: UserData.user.phoneNumber || "",
      });
    }
  }, [UserData]);

  /* Updates form field and clears success on change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...DataForm, [name]: value });
    setSuccess(false);
  };

  /* Handles avatar file selection and creates a local preview URL */
  const handleFile = (e) => {
    const file = e.target.files[0];
    setUserAvatar(file);
    if (file) {
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  /* 
   * Submits profile update via multipart/form-data.
   * Uses _method=PUT spoofing (Laravel convention).
   * On success, shows success indicator and reloads the page.
   */
  const HandleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("id", DataForm.id);
    formData.append("firstname", DataForm.firstname);
    formData.append("lastname", DataForm.lastname);
    formData.append("email", DataForm.email);
    formData.append("cin", DataForm.cin);
    formData.append("phoneNumber", DataForm.phoneNumber);
    if (UserAvatar !== null) {
      formData.append("user_avatar", UserAvatar);
    }
    formData.append("_method", "PUT");

    axiosClient
      .post("/user/update", formData)
      .then((res) => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  /* Reusable field wrapper with icon + label */
  const InputWrapper = ({ label, icon: Icon, children }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
        <Icon className="w-3.5 h-3.5 mr-2 text-brand-500" />
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Settings Sidebar — navigation links */}
          <div className="lg:w-1/4">
            <UserNavSettings />
          </div>

          {/* Settings Content — avatar upload area, personal info form, delete account section */}
          <div className="lg:w-3/4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Header Identity Section */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium">
               <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-brand-600 to-medical-400 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-all"></div>
                    <img
                      className="w-32 h-32 rounded-3xl object-cover relative ring-4 ring-white shadow-xl"
                      src={
                        previewAvatar
                          ? previewAvatar
                          : GetUserAvatar == null
                            ? "/img/Rectangle 4.jpg"
                            : "http://localhost:8000/storage/images/users/" + GetUserAvatar
                      }
                      alt={t("user_settings.user_avatar_alt", "User Avatar")}
                    />
                    <label 
                      htmlFor="DownloadFile"
                      className="absolute inset-0 bg-slate-900/40 rounded-3xl opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all backdrop-blur-[2px] border-none"
                    >
                       <CloudArrowUpIcon className="w-8 h-8 text-white" />
                    </label>
                    <input className="hidden" id="DownloadFile" type="file" name="user_avatar" onChange={handleFile} />
                  </div>

                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">{t("user_settings.account_portrait", "Account Portrait")}</h3>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mb-4">{t("user_settings.recommended_format", "Recommended: JPG or PNG, Max 800 KB")}</p>
                    <label 
                      htmlFor="DownloadFile" 
                      className="inline-flex items-center px-4 py-2 bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-white hover:border-brand-500 hover:text-brand-600 transition-all cursor-pointer"
                    >
                      {t("user_settings.update_profile_image", "Update Profile Image")}
                    </label>
                  </div>
               </div>
            </div>

            {/* Main Form Section */}
            <form onSubmit={HandleSubmit} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-premium">
              <div className="mb-10 flex items-center justify-between border-none">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{t("user_settings.personal_credentials", "Personal Credentials")}</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">{t("user_settings.keep_data_updated", "Please keep your identification data up to date.")}</p>
                 </div>
                 {success && (
                    <div className="flex items-center text-emerald-600 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 animate-in fade-in zoom-in">
                       <CheckCircleIcon className="w-4 h-4 mr-2" />
                       {t("user_settings.profile_updated", "Profile Updated")}
                    </div>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
                <InputWrapper label={t("user_settings.first_name", "First Name")} icon={UserIcon}>
                  <input
                    type="text"
                    name="firstname"
                    value={DataForm.firstname}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
                    onChange={handleChange}
                    placeholder={t("user_settings.first_name_placeholder", "e.g. Jean")}
                    required
                  />
                </InputWrapper>

                <InputWrapper label={t("user_settings.last_name", "Last Name")} icon={UserIcon}>
                  <input
                    type="text"
                    name="lastname"
                    value={DataForm.lastname}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all text-none"
                    placeholder={t("user_settings.last_name_placeholder", "e.g. Dupont")}
                    required
                  />
                </InputWrapper>

                <InputWrapper label={t("user_settings.identity_card", "Identity Card (CIN)")} icon={IdentificationIcon}>
                  <input
                    type="text"
                    value={DataForm.cin}
                    disabled
                    className="w-full px-5 py-4 bg-slate-100 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed border-none"
                    placeholder={t("user_settings.cin_placeholder", "CIN Reference")}
                  />
                </InputWrapper>

                <InputWrapper label={t("user_settings.primary_email", "Primary Email Address")} icon={EnvelopeIcon}>
                  <input
                    type="text"
                    value={DataForm.email}
                    disabled
                    className="w-full px-5 py-4 bg-slate-100 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed"
                    placeholder={t("user_settings.email_placeholder", "email@example.com")}
                  />
                </InputWrapper>

                <InputWrapper label={t("user_settings.phone_number", "Phone Number")} icon={PhoneIcon}>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={DataForm.phoneNumber}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
                    placeholder={t("user_settings.phone_placeholder", "+212 6XX XXX XXX")}
                  />
                </InputWrapper>
              </div>

              <div className="mt-12 flex pt-6 border-none">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-64 flex items-center justify-center px-8 py-4 bg-brand-600 text-white font-bold text-sm rounded-[1.5rem] hover:bg-brand-700 shadow-premium shadow-brand-200/50 transition-all active:scale-95 disabled:opacity-70"
                >
                   {loading ? t("user_settings.synchronizing", "Synchronizing...") : t("user_settings.apply_changes", "Apply Profile Changes")}
                </button>
              </div>
            </form>

            {/* Emergency Delete Section */}
            <div className="bg-rose-50/50 rounded-[2.5rem] p-10 border border-rose-100 shadow-sm">
               <div className="flex items-start gap-6 border-none">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-rose-100">
                     <ExclamationTriangleIcon className="w-8 h-8 text-rose-600" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">{t("user_settings.delete_account_title", "Sensitive Action: Delete Account")}</h3>
                    <p className="text-sm font-medium text-slate-600 mt-2 mb-8 leading-relaxed max-w-xl">
                      {t("user_settings.delete_account_description", "Once deleted, all your medical history, scheduled appointments, and account data will be permanently removed. This action cannot be undone.")}
                    </p>
                    <button className="flex items-center px-6 py-3 bg-rose-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all active:scale-95 shadow-lg shadow-rose-200">
                       <TrashIcon className="w-4 h-4 mr-2" />
                       {t("user_settings.terminate_account", "Terminate Account")}
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
