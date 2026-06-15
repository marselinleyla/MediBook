import React, { useState } from "react";
import { CloudArrowUpIcon, PhotoIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import axiosClient from "../../../AxiosClient";

/*
 * ProfileUploadImg.jsx — Doctor profile picture upload component
 * State:
 *   - selectedFile : File|null — the chosen image file
 *   - preview      : string|null — object URL for client-side preview
 *   - loading      : boolean — upload in progress
 *   - success      : boolean — shows success message for 3 seconds
 * currentAvatar: builds the full URL of the existing avatar from Redux.
 * handleFileChange(e): reads the selected file and creates a preview URL.
 * handleUpload(e): POSTs the image as FormData to /doctor/update/info
 *   along with the doctor's ID, phone, and email, then shows a success
 *   indicator for 3 seconds.
 * Renders the current or preview image with a hover overlay, an "Upload New
 * Photo" button, and a conditional "Save" button when a file is selected.
 */
const ProfileUploadImg = () => {
  const { t } = useTranslation();
  const doctorData = useSelector((state) => state.AuthDoctor);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentAvatar = doctorData?.doctor?.avatar_doctor
    ? "http://localhost:8000/storage/images/doctors/" + doctorData.doctor.avatar_doctor
    : null;

  /* Select a file and create a local preview URL */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setSuccess(false);
  };

  /* Upload the selected avatar image */
  const handleUpload = (e) => {
    e.preventDefault();
    if (!selectedFile || !doctorData?.doctor?.id) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("id", doctorData.doctor.id);
    formData.append("avatar_doctor", selectedFile);
    formData.append("phoneNumber", doctorData.doctor.phoneNumber || "");
    formData.append("email", doctorData.doctor.email || "");

    axiosClient
      .post("/doctor/update/info", formData)
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-tr from-brand-600 to-medical-400 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative p-2 bg-white rounded-[2.5rem] border border-slate-100 ring-1 ring-slate-100 shadow-xl overflow-hidden">
          <img
            className="w-48 h-48 rounded-[2.2rem] object-cover"
            src={preview || currentAvatar || "/img/doctors/doctor-default-avatar.png"}
            alt={t("doctor.alt_doctor_profile", "Doctor Profile")}
          />
          <div className="absolute inset-2 bg-slate-900/40 opacity-0 group-hover:opacity-100 rounded-[2.2rem] flex items-center justify-center transition-opacity backdrop-blur-[2px]">
             <CloudArrowUpIcon className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <h3 className="text-lg font-bold text-slate-900 leading-tight">{t("doctor.professional_portrait", "Professional Portrait")}</h3>
        <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-widest">
           {t("doctor.upload_format", "JPG, PNG • Max size 800 KB")}
        </p>

        <div className="mt-6">
          <form onSubmit={handleUpload}>
            <label
              className="inline-flex items-center px-6 py-3 text-xs font-bold text-white bg-brand-600 rounded-2xl hover:bg-brand-700 shadow-premium shadow-brand-200/50 cursor-pointer transition-all active:scale-95"
              htmlFor="DownloadFile"
            >
              <PhotoIcon className="w-4 h-4 mr-2" />
              {t("doctor.upload_new_photo", "Upload New Photo")}
            </label>
            <input
              className="hidden"
              id="DownloadFile"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full flex items-center justify-center px-6 py-3 text-xs font-bold text-white bg-brand-600 rounded-2xl hover:bg-brand-700 shadow-premium shadow-brand-200/50 transition-all active:scale-95 disabled:opacity-70"
              >
                {loading ? t("common.loading", "Loading...") : t("common.save", "Save")}
              </button>
            )}
          </form>
        </div>

        {success && (
          <div className="mt-4 flex items-center justify-center text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
            <CheckCircleIcon className="w-4 h-4 mr-2" />
            {t("doctor.photo_updated", "Photo updated successfully")}
          </div>
        )}
      </div>
      
      <div className="mt-10 p-4 border-t border-slate-50 w-full">
         <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-500 mr-2 flex-shrink-0" />
            {t("doctor.displaying_professional_image", "Displaying your professional image builds patient trust.")}
         </div>
      </div>
    </div>
  );
};

export default ProfileUploadImg;
