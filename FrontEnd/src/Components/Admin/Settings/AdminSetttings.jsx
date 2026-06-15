import React, { useState } from "react";
import { useSelector } from "react-redux";
import axiosClient from "../../../AxiosClient";
import {
  HomeIcon,
  ChevronRightIcon,
  UserCircleIcon,
  LockClosedIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AdminSetttings = () => {
  const { t } = useTranslation();
  const admin = useSelector((state) => state.AuthAdmin?.admin);
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState({
    email: admin?.email || "",
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [errors, setErrors] = useState({});

  const tabs = [
    { id: 0, label: t("admin.account_info", "Account Information"), icon: UserCircleIcon },
    { id: 1, label: t("admin.security_password", "Security & Password"), icon: LockClosedIcon },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({});
    setSuccess("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setErrors({});

    axiosClient
      .post("/admin/update", form)
      .then((res) => {
        setLoading(false);
        setSuccess(t("admin.settings_updated", "Settings updated successfully."));
        setForm({ ...form, current_password: "", new_password: "", new_password_confirmation: "" });
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors || {});
        } else {
          setErrors({ general: t("admin.update_error", "An error occurred. Please try again.") });
        }
      });
  };

  const TabButton = ({ tab, isActive }) => (
    <button
      onClick={() => setActiveTab(tab.id)}
      className={`w-full flex items-center px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
        isActive
          ? "bg-brand-600 text-white shadow-brand-200/50 shadow-lg"
          : "text-slate-500 hover:bg-slate-50 hover:text-brand-600"
      }`}
    >
      <tab.icon className={`w-5 h-5 mr-3 ${isActive ? "text-white" : "text-slate-400"}`} />
      {tab.label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      {/* Header */}
      <div className="bg-white px-8 py-8 border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2 text-[11px] font-bold uppercase tracking-widest">
              <li className="inline-flex items-center">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center text-slate-400 hover:text-brand-600 transition-colors"
                >
                  <HomeIcon className="w-3.5 h-3.5 mr-2" />
                  {t("dashboard.title")}
                </Link>
              </li>
              <li className="flex items-center text-brand-600">
                <ChevronRightIcon className="w-3 h-3 mx-1" />
                <span className="ml-1 tracking-widest">{t("admin.settings", "Settings")}</span>
              </li>
            </ol>
          </nav>

          <div className="flex items-start">
            <div className="p-3 bg-brand-50 rounded-2xl border border-brand-100 mr-4">
              <Cog6ToothIcon className="w-8 h-8 text-brand-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                {t("admin.account_settings", "Account Settings")}
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                {t("admin.account_settings_desc", "Manage your admin account credentials and security preferences.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto w-full px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar / Tab Navigation */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-premium overflow-hidden">
              <div className="p-8 text-center">
                <div className="w-24 h-24 mx-auto rounded-[2rem] bg-gradient-to-br from-brand-600 to-medical-500 flex items-center justify-center text-white text-3xl font-black shadow-lg mb-4">
                  {admin?.email?.charAt(0).toUpperCase() || "A"}
                </div>
                <p className="text-sm font-bold text-slate-900">{admin?.email || "admin@example.com"}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  {t("admin.administrator", "Administrator")}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-premium p-3 space-y-1">
              {tabs.map((tab) => (
                <TabButton key={tab.id} tab={tab} isActive={activeTab === tab.id} />
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
                    {t("admin.section", "Section")} {activeTab + 1}
                  </span>
                </div>

                {/* Success alert */}
                {success && (
                  <div className="mb-6 flex items-center p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold rounded-2xl">
                    <CheckCircleIcon className="w-5 h-5 mr-3" />
                    {success}
                  </div>
                )}

                {/* Error alert */}
                {errors.general && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-bold rounded-2xl">
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Tab 0: Account Information */}
                  {activeTab === 0 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-start p-6 bg-brand-50/50 rounded-3xl border border-brand-100">
                        <EnvelopeIcon className="w-6 h-6 text-brand-600 mr-4 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {t("admin.account_email", "Account Email")}
                          </p>
                          <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">
                            {t("admin.account_email_desc", "Update the email address associated with your admin account.")}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                          <EnvelopeIcon className="w-3.5 h-3.5 mr-2 text-brand-500" />
                          {t("admin.email_address", "Email Address")}
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-300 ${
                            errors.email ? "border-red-300" : "border-slate-100"
                          }`}
                          placeholder="admin@example.com"
                        />
                        {errors.email && (
                          <p className="text-xs font-bold text-red-500 mt-1">{errors.email[0]}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tab 1: Security & Password */}
                  {activeTab === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-start p-6 bg-amber-50/50 rounded-3xl border border-amber-100">
                        <ShieldCheckIcon className="w-6 h-6 text-amber-600 mr-4 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">
                            {t("admin.security_recommendation", "Security Recommendation")}
                          </p>
                          <p className="text-xs font-medium text-slate-600 mt-1 leading-relaxed">
                            {t("admin.security_recommendation_desc", "Use a strong, unique password with at least 8 characters, including numbers and symbols.")}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2 space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                            <LockClosedIcon className="w-3.5 h-3.5 mr-2 text-brand-500" />
                            {t("admin.current_password", "Current Password")}
                          </label>
                          <input
                            type="password"
                            name="current_password"
                            value={form.current_password}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-300 ${
                              errors.current_password ? "border-red-300" : "border-slate-100"
                            }`}
                            placeholder="••••••••••••"
                          />
                          {errors.current_password && (
                            <p className="text-xs font-bold text-red-500 mt-1">{errors.current_password[0]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                            <KeyIcon className="w-3.5 h-3.5 mr-2 text-brand-500" />
                            {t("admin.new_password", "New Password")}
                          </label>
                          <input
                            type="password"
                            name="new_password"
                            value={form.new_password}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-300 ${
                              errors.new_password ? "border-red-300" : "border-slate-100"
                            }`}
                            placeholder="••••••••••••"
                          />
                          {errors.new_password && (
                            <p className="text-xs font-bold text-red-500 mt-1">{errors.new_password[0]}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                            <KeyIcon className="w-3.5 h-3.5 mr-2 text-brand-500" />
                            {t("admin.confirm_new_password", "Confirm New Password")}
                          </label>
                          <input
                            type="password"
                            name="new_password_confirmation"
                            value={form.new_password_confirmation}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder:text-slate-300 ${
                              errors.new_password ? "border-red-300" : "border-slate-100"
                            }`}
                            placeholder="••••••••••••"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full md:w-64 flex items-center justify-center px-8 py-4 text-sm font-bold text-white bg-brand-600 rounded-[1.5rem] hover:bg-brand-700 shadow-premium shadow-brand-200/50 transition-all active:scale-95 disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                          {t("admin.saving", "Saving...")}
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="w-5 h-5 mr-3" />
                          {t("admin.save_changes", "Save Changes")}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSetttings;
