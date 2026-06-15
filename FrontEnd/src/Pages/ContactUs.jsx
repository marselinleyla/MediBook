import React, { useState } from "react";
import { Footer, Header } from "../Components";
import axiosClient from "../AxiosClient";
import { useTranslation } from "react-i18next";
import { PhoneIcon, EnvelopeIcon, MapPinIcon, ChatBubbleBottomCenterTextIcon, IdentificationIcon, CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

/*
 * ContactUs — Public contact/support page
 * Renders a hero header, a contact form (name, email, message), and contact detail cards.
 * State:
 *   form — { name, email, message } controlled form fields
 *   loading — submit button spinner
 *   success — brief success banner after submission
 *   errors — per-field validation errors from the server (422)
 * API:
 *   POST /contact — submits the contact form
 */
export const ContactUs = () => {
  const { t } = useTranslation();
  document.title = t("contact.title", "Contact MediBook Support");

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  /* Updates form field and clears its error on change */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  /* Submits contact form to the API, shows success or per-field errors */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrors({});

    axiosClient
      .post("/contact", form)
      .then((res) => {
        setLoading(false);
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
      })
      .catch((err) => {
        setLoading(false);
        if (err.response?.status === 422) {
          setErrors(err.response.data.errors || {});
        }
      });
  };

  /* Reusable contact detail card (icon, label, value) */
  const ContactItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group hover:shadow-premium group hover:border-brand-100 transition-all">
       <div className="p-3 bg-brand-50 rounded-2xl text-brand-600 mr-4 group-hover:bg-brand-600 group-hover:text-white transition-all">
          <Icon className="w-6 h-6" />
       </div>
       <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-sm font-bold text-slate-800 leading-tight">{value}</p>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section — page title, subtitle, decorative background blur */}
        <div className="bg-slate-50 border-b border-slate-100 relative overflow-hidden pt-20 pb-12">
           <div className="absolute top-0 right-0 w-96 h-96 bg-brand-200/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
           <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                 {t("contact.title")}
              </h1>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                 {t("contact.heroDescription", "Have questions about our medical platform? Our dedicated support team is here to assist doctors and patients 24/7.")}
              </p>
           </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 ">

            {/* Contact Form — name, email, message fields with per-field validation errors */}
            <div className="lg:col-span-12 xl:col-span-5 border-none">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-8 relative z-10">{t("contact.sendMessageTitle", "Send a Message")}</h3>

                <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
                  {/* Name field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <IdentificationIcon className="w-3.5 h-3.5 mr-2 text-brand-500" />
                      {t("contact.nameLabel")}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                      placeholder={t("contact.namePlaceholder")}
                      required
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-[11px] font-medium text-rose-600 ml-1">{errors.name[0]}</p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <EnvelopeIcon className="w-3.5 h-3.5 mr-2 text-brand-500" />
                      {t("contact.emailLabel")}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300"
                      placeholder={t("contact.emailPlaceholder")}
                      required
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-[11px] font-medium text-rose-600 ml-1">{errors.email[0]}</p>
                    )}
                  </div>

                  {/* Message textarea */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
                      <ChatBubbleBottomCenterTextIcon className="w-3.5 h-3.5 mr-2 text-brand-500" />
                      {t("contact.messageLabel")}
                    </label>
                    <textarea
                      name="message"
                      rows="4"
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all placeholder-slate-300 resize-none"
                      placeholder={t("contact.messagePlaceholder")}
                      required
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1.5 text-[11px] font-medium text-rose-600 ml-1">{errors.message[0]}</p>
                    )}
                  </div>

                  {/* Success banner after successful submission */}
                  {success && (
                    <div className="flex items-center text-emerald-600 font-bold text-[10px] uppercase tracking-widest bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 animate-in fade-in zoom-in">
                      <CheckCircleIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                      {t("contact.successMessage", "Message sent successfully! We will get back to you shortly.")}
                    </div>
                  )}

                  {/* Submit button with loading spinner */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-brand-600 text-white font-bold text-sm rounded-[1.5rem] hover:bg-brand-700 shadow-premium shadow-brand-200/50 transition-all active:scale-95 uppercase tracking-widest disabled:opacity-70"
                  >
                    {loading ? t("contact.sending", "Sending...") : t("contact.sendButton")}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Details — phone numbers and email displayed as info cards */}
            <div className="lg:col-span-12 xl:col-span-7 border-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-fit mt-5">
                 <ContactItem
                    icon={PhoneIcon}
                    label="Emergency Service"
                    value={t("contact.phoneNumber")}
                 />
                 <ContactItem
                    icon={PhoneIcon}
                    label="Office Direct"
                    value={t("contact.officePhoneNumber")}
                 />
                 <ContactItem
                    icon={EnvelopeIcon}
                    label="Support Email"
                    value={t("contact.emailAddress")}
                 />
                 
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactUs;
