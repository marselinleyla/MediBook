import React from "react";
import { Footer, Header } from "../Components";
import { useTranslation } from "react-i18next";
import { ShieldCheckIcon, HeartIcon, SparklesIcon, UsersIcon } from "@heroicons/react/24/outline";

/* 
 * Aboutus - Public "About MediBook" page
 * Renders a marketing/landing page explaining the platform's mission, values, and team culture.
 * Sections: Hero (mission statement + certified badge), Values (3 cards), Gallery (image mosaic).
 * No state, no API calls — purely presentational.
 */
export const Aboutus = () => {
  const { t } = useTranslation();
  document.title = t("about.page_title", "About MediBook");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Hero Section: mission badge, title, welcome text on left; doctor image + ISO privacy badge on right */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-50/50 -skew-x-12 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="animate-in fade-in slide-in-from-left-8 duration-700">
                <span className="px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-widest border border-brand-100 mb-6 inline-block">
                  {t("about.our_mission")}
                </span>
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                  {t("about.aboutUsTitle")}
                </h1>
                <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-10 shadow-premium border border-slate-100 text-lg leading-relaxed text-slate-600">
                   {t("about.welcomeMessage")}
                </div>
              </div>
              <div className="relative animate-in fade-in slide-in-from-right-8 duration-700">
                <div className="absolute -inset-4 bg-brand-600/5 rounded-[3rem] blur-2xl"></div>
                <img
                  src="./img/Doctors2.jpg"
                  className="w-full rounded-[3rem] shadow-2xl relative ring-1 ring-slate-200"
                  alt={t("about.alt_board_doctors", "Board of Doctors")}
                />
                <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-[2rem] shadow-premium border border-slate-50 flex items-center gap-4">
                   <div className="p-3 bg-emerald-50 rounded-2xl">
                      <ShieldCheckIcon className="w-8 h-8 text-emerald-600" />
                   </div>
                   <div>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{t("about.certified")}</p>
                       <p className="text-lg font-black text-slate-900 tracking-tight">{t("about.iso_privacy")}</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section: 3 cards — Patient Care, Data Security, Community — with hover effects */}
        <section className="py-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
               <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">{t("about.foundation_title")}</h2>
               <p className="text-slate-500 font-medium leading-relaxed">{t("about.foundation_desc")}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium group hover:-translate-y-2 transition-transform h-full">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-8 group-hover:bg-brand-600 group-hover:text-white transition-all">
                     <HeartIcon className="w-8 h-8" />
                  </div>
                   <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{t("about.patient_care")}</h4>
                   <div className="text-slate-500 text-sm leading-relaxed overflow-hidden">
                      {t("about.bookingSystemMessage")}
                   </div>
               </div>

               <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium group hover:-translate-y-2 transition-transform h-full">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-8 group-hover:bg-brand-600 group-hover:text-white transition-all">
                     <ShieldCheckIcon className="w-8 h-8" />
                  </div>
                   <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{t("about.data_security")}</h4>
                   <div className="text-slate-500 text-sm leading-relaxed overflow-hidden">
                      {t("about.dataPrivacyMessage")}
                   </div>
               </div>

               <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-premium group hover:-translate-y-2 transition-transform h-full">
                  <div className="w-14 h-14 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 mb-8 group-hover:bg-brand-600 group-hover:text-white transition-all">
                     <UsersIcon className="w-8 h-8" />
                  </div>
                   <h4 className="text-xl font-bold text-slate-900 mb-4 tracking-tight">{t("about.community")}</h4>
                   <p className="text-slate-500 text-sm leading-relaxed">{t("about.community_desc")}</p>
               </div>
            </div>
          </div>
        </section>

        {/* Gallery Section: image grid (2 cols, varied row spans) showcasing clinic/pharmacy/hospital/doctors + innovation quote */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-12 flex items-center">
              {t("about.life_at_medibook")}
              <div className="h-1 flex-grow bg-slate-100 ml-8 rounded-full"></div>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[600px]">
              <div className="col-span-1 row-span-2">
                  {/* Clinic image - tall left column */}
                  <img src="./img/Rectangle 9.png" className="w-full h-full object-cover rounded-[2.5rem] shadow-lg" alt={t("about.alt_clinic")} />
                </div>
                <div className="col-span-2 row-span-1">
                  {/* Pharmacy image - wide top-right */}
                  <img src="./img/medicament.jpg" className="w-full h-full object-cover rounded-[2.5rem] shadow-lg" alt={t("about.alt_pharmacy")} />
                </div>
                <div className="col-span-1 row-span-1">
                  {/* Hospital image - small bottom-left */}
                  <img src="./img/hospital.jpg" className="w-full h-full object-cover rounded-[2.5rem] shadow-lg" alt={t("about.alt_hospital")} />
                </div>
                <div className="col-span-1 row-span-1">
                  {/* Doctors consultation image - small bottom-middle */}
                  <img src="./img/doctors3.jpg" className="w-full h-full object-cover rounded-[2.5rem] shadow-lg" alt={t("about.alt_consultation")} />
                </div>
                <div className="col-span-1 row-span-1">
                  {/* Innovation quote tile - brand-colored card with sparkles icon */}
                  <div className="w-full h-full bg-brand-600 rounded-[2.5rem] shadow-lg flex flex-col items-center justify-center text-white p-8 text-center italic font-medium">
                     <SparklesIcon className="w-10 h-10 mb-4 opacity-50" />
                     {t("about.innovation_quote")}
                  </div>
                </div>
             </div>
           </div>
         </section>
       </main>

      <Footer />
    </div>
  );
};

export default Aboutus;
