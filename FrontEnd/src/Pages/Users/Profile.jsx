import { Footer, Header, UserNavSettings } from "../../Components";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../../AxiosClient";
import { logout } from "../../Redux/SliceAuthUser";
import { useNavigate } from "react-router";
import { remove } from "../../Services/LocalStorageService";
import GetAuthUser from "../../hooks/GetAuthUser";
import { UserIcon, IdentificationIcon, PhoneIcon, EnvelopeIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * User Profile — Authenticated user's profile page
 * Displays user info (avatar, name, email, CIN, phone) and provides a logout action.
 * State:
 *   UserData — from Redux authUser slice
 * Handlers:
 *   HandleLogout — POST /user/logout, clears Redux + localStorage, redirects to /Connexion
 * Auth: GetAuthUser() guards the route
 */
const Profile = () => {
  const { t } = useTranslation();
  const UserData = useSelector((state) => state.authUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  GetAuthUser();

  /* Sends logout request, clears Redux state and localStorage token, redirects */
  const HandleLogout = () => {
    axiosClient
      .post("/user/logout")
      .then((res) => {
        if (res.data.success && res.status === 200) {
          dispatch(logout());
          remove("TOKEN_USER");
          navigate("/Connexion");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* Settings Sidebar — navigation links */}
          <div className="lg:w-1/4">
            <UserNavSettings />
          </div>

          {/* Profile Content — header card, info grid, account actions */}
          <div className="lg:w-3/4">
            {UserData.user ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Profile Header Card */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-premium flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-brand-50 rounded-full -mr-24 -mt-24 opacity-50"></div>
                  
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-tr from-brand-600 to-medical-400 rounded-[2.2rem] blur opacity-20"></div>
                    <img
                      className="w-36 h-36 rounded-[2rem] object-cover relative ring-4 ring-white shadow-xl"
                      src={UserData.user.user_avatar ? "http://localhost:8000/storage/images/users/" + UserData.user.user_avatar : "/img/Rectangle 4.jpg"}
                      alt={t("profile.user_profile", "User Profile")}
                    />
                  </div>
                  
                  <div className="relative z-10 flex-grow">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                       <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-brand-100">{t("profile.verified_patient", "Verified Patient")}</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                      {UserData.user.firstname} {UserData.user.lastname}
                    </h1>
                    <p className="text-slate-500 font-medium mt-2 flex items-center justify-center md:justify-start">
                      <EnvelopeIcon className="w-4 h-4 mr-2 text-brand-500" />
                      {UserData.user.email}
                    </p>
                  </div>
                </div>

                {/* Information Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-premium group hover:border-brand-100 transition-all">
                      <div className="p-3 bg-brand-50 rounded-2xl w-fit mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all">
                         <IdentificationIcon className="w-6 h-6" />
                      </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t("profile.identity_document", "Identity Document (CIN)")}</p>
                      <p className="text-lg font-bold text-slate-800 tracking-tight">{UserData.user.cin}</p>
                   </div>

                   <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-premium group hover:border-brand-100 transition-all">
                      <div className="p-3 bg-brand-50 rounded-2xl w-fit mb-6 group-hover:bg-brand-600 group-hover:text-white transition-all">
                         <PhoneIcon className="w-6 h-6" />
                      </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t("profile.registered_phone", "Registered Phone")}</p>
                      <p className="text-lg font-bold text-slate-800 tracking-tight">{UserData.user.phoneNumber || "Not provided"}</p>
                   </div>
                </div>

                {/* Account Actions */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-premium flex flex-col md:flex-row items-center justify-between gap-6">
                   <div>
                       <h4 className="text-lg font-bold text-slate-900">{t("profile.advanced_account_access", "Advanced Account Access")}</h4>
                       <p className="text-sm font-medium text-slate-500 mt-1">{t("profile.sign_out_description", "Sign out of your session on this device securely.")}</p>
                   </div>
                   <button
                      onClick={HandleLogout}
                      className="inline-flex items-center px-8 py-4 bg-rose-50 text-rose-600 font-bold text-sm rounded-2xl hover:bg-rose-600 hover:text-white transition-all active:scale-95 group shadow-sm"
                   >
                     <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
                     {t("profile.secure_logout", "Secure Logout")}
                   </button>
                </div>
              </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-slate-100 shadow-premium">
                  <div className="w-16 h-16 border-4 border-slate-100 border-t-brand-600 rounded-full animate-spin"></div>
                   <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">{t("profile.loading_identity", "Loading Identity...")}</p>
               </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
