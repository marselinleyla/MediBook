import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Card from "./Card";
import axiosClient from "../../AxiosClient";

/*
 * Section.jsx — Home page main content section
 * State:
 *   - Doctors : array — list of featured doctors fetched from the API
 * Fetches doctors on mount via POST /doctor/home.
 * Renders four sections:
 *   1. Hero: headline, description, CTA buttons, doctor image with
 *      floating stat cards (100k+ patients).
 *   2. Quality Service: 3-column feature grid (Global Experts, Modern
 *      Tech, Personalized Care).
 *   3. Doctors Grid: row of Card components for each doctor fetched.
 *   4. CTA: dark call-to-action banner with "Schedule Appointment" and
 *      "Talk to Support" links.
 */
const Section = () => {
  const { t } = useTranslation();
  const [Doctors, setDoctors] = useState([]);

  /* Fetch featured doctors on mount */
  useEffect(() => {
    axiosClient
      .post("/doctor/home")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-brand-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-primary-50 rounded-full blur-[120px] translate-y-1/4 -translate-x-1/4" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <div className="mb-12 lg:mb-0 lg:self-start -mt-8 lg:-mt-16">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-sm font-bold mb-6 transition-transform hover:scale-105 cursor-default">
                <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-pulse"></span>
                <span>{t("home.trusted_platform", "The most trusted medical platform")}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
                {t("common.section_title").split(' ').map((word, i) => (
                  <span key={i} className={i >= 3 ? "text-brand-600" : ""}> {word} </span>
                ))}
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg">
                {t("common.section_description")}
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link 
                  to="/recherche" 
                  className="px-8 py-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl text-center shadow-premium hover:shadow-premium-hover transition-all transform active:scale-[0.98]"
                >
                  {t("common.schedule_appointment")}
                </Link>
                <Link 
                  to="/about" 
                  className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold rounded-2xl text-center transition-all"
                >
                  {t("home.learn_more", "Learn More")}
                </Link>
              </div>
            </div>

            <div className="relative -mt-8 lg:-mt-16">
              <div className="relative z-20 rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src="./img/doctor-2.png"
                  className="w-full h-auto"
                  alt="Doctor"
                />
              </div>
              
              {/* Interactive Info Cards */}
              <div className="absolute -bottom-6 -left-6 z-30 bg-white p-6 rounded-3xl shadow-premium border border-slate-100 animate-bounce-slow">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-brand-100 rounded-2xl text-brand-600">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">100k+</p>
                    <p className="text-sm font-medium text-slate-500">{t("home.active_patients", "Active Patients")}</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 z-30 p-4 bg-emerald-500 rounded-full shadow-lg text-white animate-pulse">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Service Section */}
      <section className="py-24 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
              {t("common.service_quality_title")}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">
              {t("common.service_quality_description")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: "./img/Rectangle 4.jpg", title: t("home.global_experts_title", "Global Experts"), desc: t("home.global_experts_desc", "Access top specialists worldwide") },
              { img: "./img/Rectangle 5.jpg", title: t("home.modern_tech_title", "Modern Tech"), desc: t("home.modern_tech_desc", "Best-in-class clinical tools") },
              { img: "./img/Rectangle 6.jpg", title: t("home.personalized_care_title", "Personalized Care"), desc: t("home.personalized_care_desc", "Treatment plans just for you") }
            ].map((feature, i) => (
              <div key={i} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-premium transition-all">
                <div className="h-48 overflow-hidden">
                  <img src={feature.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctors Listing */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                {t("common.book_our_doctors")}
              </h2>
              <div className="h-1.5 w-24 bg-brand-600 rounded-full" />
            </div>
            <Link to="/recherche" className="hidden sm:flex items-center text-brand-600 font-bold hover:translate-x-1 transition-transform">
              {t("home.view_all_doctors", "View All Doctors")}
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Doctors.map((info, idx) => (
              <Card
                key={info.id || idx}
                id={info.id}
                img={info.avatar_doctor}
                name={info.firstname + " " + info.lastname}
                specialite={info.specialite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 lg:p-24 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-primary-600/20 rounded-full blur-[100px]" />
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-8 max-w-2xl mx-auto leading-tight">
              {t("common.take_care_of_yourself")}
            </h2>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link 
                to="/recherche"
                className="px-10 py-5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-[0.98]"
              >
                {t("common.schedule_appointment")}
              </Link>
              <Link 
                to="/contact"
                className="px-10 py-5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-2xl transition-all backdrop-blur-sm"
              >
                {t("home.talk_to_support", "Talk to Support")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Section;

