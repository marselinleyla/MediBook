import React, { useEffect, useState } from "react";
import GetAuthDoctor from "../../../hooks/GetAuthDoctor";
import { useSelector } from "react-redux";
import axiosClient from "../../../AxiosClient";
import AuthButton from "../../AuthButton";
import { UserIcon, IdentificationIcon, PhoneIcon, EnvelopeIcon, AcademicCapIcon, HomeModernIcon, MapPinIcon, ChatBubbleBottomCenterTextIcon, SignalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

/*
 * PersonalInformation.jsx — Doctor's personal & professional info editor
 * State:
 *   - DataForm : object — fields synced from Redux doctor data (name, CIN,
 *     email, Matricule, specialite, clinic info, availability, about bio)
 *   - loading  : boolean — submit button loading state
 * GetAuthDoctor() hook ensures auth data is loaded.
 * Populates DataForm from Redux doctorData on mount via useEffect.
 * Functions:
 *   HandelChangeCheckbox(e): toggles the "available" boolean field.
 *   HandelChange(e): updates any form field by name attribute.
 *   HandelSubmit(e): POSTs the form data to /doctor/update/info.
 * InputWrapper: renders a labeled form group with icon.
 * Renders an availability toggle switch, a two-column grid of input
 * fields, a bio textarea, clinic name/address fields, and an AuthButton
 * for submission.
 */
const PersonalInformation = () => {
  const { t } = useTranslation();
  const doctorData = useSelector((state) => state.AuthDoctor);  
  const [loading, setLoading] = useState(false);

  const [DataForm, setDataForm] = useState({
    id: "",
    firstname: "",
    lastname: "",
    cin: "",
    phoneNumber: "",
    email: "",
    Matricule: "",
    specialite: "",
    nom_cabinet: "",
    address_cabinet: "",
    available: false,
    about: "",
  });

  GetAuthDoctor();

  /* Populate form fields from Redux doctor data when available */
  useEffect(() => {
    if (doctorData.doctor !== null) {
      setDataForm({
        id: doctorData.doctor.id,
        firstname: doctorData.doctor.firstname || "",
        lastname: doctorData.doctor.lastname || "",
        cin: doctorData.doctor.cin || "",
        phoneNumber: doctorData.doctor.phoneNumber || "",
        email: doctorData.doctor.email || "",
        Matricule: doctorData.doctor.Matricule || "",
        specialite: doctorData.doctor.specialite || "",
        nom_cabinet: doctorData.doctor.nom_cabinet || "",
        address_cabinet: doctorData.doctor.address_cabinet || "",
        available: doctorData.doctor.available === "1",
        about: doctorData.doctor.about || "",
      });
    }
  }, [doctorData]);

  /* Handle the availability checkbox toggle */
  const HandelChangeCheckbox = (e) => {
    setDataForm({ ...DataForm, available: e.target.checked });
  };

  /* Handle text/input field changes by name */
  const HandelChange = (e) => {
    const { name, value } = e.target;
    setDataForm({ ...DataForm, [name]: value });
  };

  /* Submit the updated profile data to the API */
  const HandelSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    axiosClient
      .post("/doctor/update/info", DataForm)
      .then((res) => {
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const InputWrapper = ({ label, icon: Icon, children }) => (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
        <Icon className="w-3.5 h-3.5 mr-2 text-brand-500" />
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <form onSubmit={HandelSubmit} className="space-y-10">
        {/* availability Switch */}
        <div className="flex items-center justify-between p-6 bg-brand-50/50 rounded-3xl border border-brand-100">
          <div className="flex items-center">
            <div className={`p-3 rounded-2xl ${DataForm.available ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-200 text-slate-500'} shadow-lg mr-4 transition-all duration-500`}>
                <SignalIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 leading-none">{t("doctor.practice_availability", "Practice Availability")}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
                {DataForm.available ? t("doctor.visible_to_patients", 'You are currently visible to patients') : t("doctor.hidden_from_search", 'Your profile is hidden from search results')}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={DataForm.available}
              name="available"
              onChange={HandelChangeCheckbox}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-6 after:transition-all peer-checked:bg-brand-600 transition-colors"></div>
          </label>
        </div>

        {/* Form Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputWrapper label={t("doctor.first_name", "First Name")} icon={UserIcon}>
            <input
              type="text"
              name="firstname"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
              placeholder={t("doctor.enter_first_name", "Enter first name")}
              required
              value={DataForm.firstname}
              onChange={HandelChange}
            />
          </InputWrapper>

          <InputWrapper label={t("doctor.last_name", "Last Name")} icon={UserIcon}>
            <input
              type="text"
              name="lastname"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
              placeholder={t("doctor.enter_last_name", "Enter last name")}
              required
              value={DataForm.lastname}
              onChange={HandelChange}
            />
          </InputWrapper>

          <InputWrapper label={t("doctor.medical_id", "Medical ID / Matricule")} icon={IdentificationIcon}>
            <input
              type="text"
              name="Matricule"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
              placeholder={t("doctor.matricule_placeholder", "e.g. MED-8892")}
              required
              value={DataForm.Matricule}
              onChange={HandelChange}
            />
          </InputWrapper>

          <InputWrapper label={t("doctor.specialization", "Specialization")} icon={AcademicCapIcon}>
            <input
              type="text"
              name="specialite"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
              placeholder={t("doctor.specialization_placeholder", "e.g. Cardiology")}
              required
              value={DataForm.specialite}
              onChange={HandelChange}
            />
          </InputWrapper>

          <InputWrapper label={t("doctor.contact_phone", "Contact Phone")} icon={PhoneIcon}>
            <input
              type="text"
              name="phoneNumber"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
              placeholder={t("doctor.phone_placeholder", "+212 600-000000")}
              required
              value={DataForm.phoneNumber}
              onChange={HandelChange}
            />
          </InputWrapper>

          <InputWrapper label={t("doctor.professional_email", "Professional Email")} icon={EnvelopeIcon}>
            <input
              type="email"
              name="email"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
              placeholder={t("doctor.email_placeholder", "doctor@medibook.com")}
              required
              value={DataForm.email}
              onChange={HandelChange}
            />
          </InputWrapper>
        </div>

        {/* Bio Section */}
        <InputWrapper label={t("doctor.about_biography", "About / Professional Biography")} icon={ChatBubbleBottomCenterTextIcon}>
          <textarea
            rows="4"
            name="about"
            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all resize-none"
            placeholder={t("doctor.introduce_yourself", "Introduce yourself to your patients...")}
            value={DataForm.about}
            onChange={HandelChange}
          />
        </InputWrapper>

        {/* Cabinet Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          <InputWrapper label={t("doctor.clinic_office_name", "Clinic / Office Name")} icon={HomeModernIcon}>
            <input
              type="text"
              name="nom_cabinet"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
              placeholder="e.g. MediCenter Health"
              required
              value={DataForm.nom_cabinet}
              onChange={HandelChange}
            />
          </InputWrapper>

          <InputWrapper label={t("doctor.business_address", "Business Address")} icon={MapPinIcon}>
            <input
              type="text"
              name="address_cabinet"
              className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all"
              placeholder={t("doctor.street_city_country", "Street, City, Country")}
              required
              value={DataForm.address_cabinet}
              onChange={HandelChange}
            />
          </InputWrapper>
        </div>

        {/* Action Button */}
        <div className="flex pt-6">
          <div className="w-full md:w-64">
            <AuthButton Text={t("doctor.save_information", "Save Information")} Loading={loading} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PersonalInformation;
