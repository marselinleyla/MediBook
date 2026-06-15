import React, { useState } from "react";
import ChangePassword from "./ChangePassword";
import Gallery from "./Gallery";
import PersonalInformation from "./PersonalInformation";
import ProfileUploadImg from "./ProfileUploadImg";
import TamingWork from "./TamingWork";
import { Link } from "react-router-dom";
import { HomeIcon, ChevronRightIcon, UserCircleIcon, AdjustmentsHorizontalIcon, LockClosedIcon, PhotoIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * Setttings.jsx — Doctor settings page with tabbed navigation
 * State:
 *   - activeTab : number — index of the currently selected settings tab
 * Tabs array defines 4 sections: PersonalInformation, TamingWork
 * (appointment scheduling), ChangePassword, and Gallery. The left sidebar
 * shows the profile upload component and tab buttons; the right content
 * area renders the active tab's component.
 */
const Setttings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { id: 0, label: t("doctor.personal_information", "Personal Information"), icon: UserCircleIcon, component: PersonalInformation },
    { id: 1, label: t("doctor.appointment_settings", "Appointment Settings"), icon: AdjustmentsHorizontalIcon, component: TamingWork },
    { id: 2, label: t("doctor.security_password", "Security & Password"), icon: LockClosedIcon, component: ChangePassword },
    { id: 3, label: t("gallery.title", "Medical Gallery"), icon: PhotoIcon, component: Gallery },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      {/* Header of Page */}
      <div className="bg-white px-8 py-8 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest">
              <li className="inline-flex items-center">
                <Link
                  to="/doctor/dashboard"
                  className="flex items-center text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <HomeIcon className="w-3.5 h-3.5 mr-2" />
                  {t("dashboard.title")}
                </Link>
              </li>
              <li className="flex items-center text-brand-600">
                <ChevronRightIcon className="w-3 h-3 mx-1" />
                <span className="ml-1 tracking-widest">{t("doctor.profile_configuration", "Profile Configuration")}</span>
              </li>
            </ol>
          </nav>
          
          <div className="flex items-start">
            <div className="p-3 bg-brand-50 rounded-2xl border border-brand-100 mr-4">
              <Cog6ToothIcon className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {t("doctor.account_settings", "Account Settings")}
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                {t("doctor.account_settings_desc", "Update your professional profile, availability, and security preferences.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto w-full px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar / Profile Card */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
               <div className="p-8">
                  <ProfileUploadImg />
               </div>
            </div>

            {/* Tab Navigation (Mobile - Vertical list or Desktop - Sidebar style) */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-premium p-3 space-y-1">
               {tabs.map((tab) => (
                 <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                      activeTab === tab.id 
                      ? 'bg-brand-600 text-white shadow-brand-200/50 shadow-lg' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-brand-600'
                    }`}
                 >
                   <tab.icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-white' : 'text-slate-400'}`} />
                   {tab.label}
                 </button>
               ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium p-1">
               <div className="p-8">
                 <div className="mb-8 pb-6 border-b border-slate-50 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">{tabs[activeTab].label}</h2>
                    <span className="px-3 py-1 bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-widest rounded-full">
                       {t("doctor.section", "Section")} {activeTab + 1}
                    </span>
                 </div>
                 
                 <div className="transition-all duration-300">
                    {activeTab === 0 && <PersonalInformation />}
                    {activeTab === 1 && <TamingWork />}
                    {activeTab === 2 && <ChangePassword />}
                    {activeTab === 3 && <Gallery />}
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setttings;
