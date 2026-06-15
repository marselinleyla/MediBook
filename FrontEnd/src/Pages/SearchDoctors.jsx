import React, { useState, useEffect } from "react";
import {
  Footer,
  Header,
  AlertToRegistre,
  SearchDoctorCard,
  Spinner,
} from "../Components";
import { MagnifyingGlassIcon, MapPinIcon, AcademicCapIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";
import axiosClient from "../AxiosClient";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

/*
 * SearchDoctors — Public doctor search page
 * Multi-criteria search form (specialty, location, doctor name, facility name)
 * that fetches matching doctors from the backend and displays them as cards.
 * State:
 *   DataForm — { specialite, address_cabinet, firstname, nom_cabinet } search criteria
 *   DataSearch — array of matching doctor objects from API
 *   Loading — spinner while fetching
 *   showAlertToRegistre — controls registration prompt alert
 * API:
 *   POST /search/doctors — sends filter criteria, returns matching doctors
 * Children: SearchDoctorCard (per-result card), AlertToRegistre
 */
const SearchDoctors = () => {
  const { t } = useTranslation();
  document.title = t("search.title", "Search Doctors | MediBook");

  const AuthUserData = useSelector((state) => state.authUser);
  const [Loading, setLoading] = useState(false);
  const [DataForm, setDataForm] = useState({
    specialite: "",
    address_cabinet: "",
    firstname: "",
    nom_cabinet: "",
  });

  const [DataSearch, setDataSearch] = useState([]);

  /* Initial fetch on mount (empty filters returns all doctors) */
  useEffect(() => {
    setLoading(true);
    axiosClient
      .post("/search/doctors", DataForm)
      .then((res) => {
        setDataSearch(res.data.DataSearch || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, []);

  /* Updates search form field on input change */
  const HandleChangeData = (ev) => {
    const { name, value } = ev.target;
    setDataForm({ ...DataForm, [name]: value });
  };

  /* Submits the search filters and updates results */
  const HandleSubmitData = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosClient
      .post("/search/doctors", DataForm)
      .then((res) => {
        setDataSearch(res.data.DataSearch);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  /* Registration alert state from Redux */
  const [showAlertToRegistre, setSowAlertToRegistre] = useState(
    AuthUserData.showAlertToAuth
  );

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />
      
      {/* Search Hero Section — title, subtitle, and the multi-field search bar */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-white">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-50">
          <div className="absolute top-24 left-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-100/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
            {t("search.find_best", "Find the Best")} <span className="text-brand-600">{t("search.healthcare", "Healthcare")}</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12">
            {t("search.search_description", "Search for verified doctors by specialty, location, or name and book your appointment in seconds.")}
          </p>

          {/* Search Bar Container */}
          <div className="max-w-6xl mx-auto">
            <div className="bg-white p-3 rounded-[2.5rem] shadow-premium border border-slate-100">
              <form onSubmit={HandleSubmitData} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
                
                {/* Specialty Input — search by medical specialty */}
                <div className="flex-1 flex items-center px-6 py-4 bg-slate-50 rounded-[2rem] border border-transparent focus-within:border-brand-200 focus-within:bg-white transition-all group">
                  <AcademicCapIcon className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 mr-3" />
                  <div className="flex flex-col text-left w-full">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t("search.specialty", "Specialty")}</label>
                    <input
                      name="specialite"
                      type="text"
                      className="bg-transparent border-0 p-0 text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-0 w-full"
                      placeholder={t("search.specialty_placeholder", "Cardiology, Dentist...")}
                      onChange={HandleChangeData}
                    />
                  </div>
                </div>

                {/* City Input — filter by doctor's office address / city */}
                <div className="flex-1 flex items-center px-6 py-4 bg-slate-50 rounded-[2rem] border border-transparent focus-within:border-brand-200 focus-within:bg-white transition-all group">
                  <MapPinIcon className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 mr-3" />
                  <div className="flex flex-col text-left w-full">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t("search.location", "Location")}</label>
                    <input
                      name="address_cabinet"
                      type="text"
                      className="bg-transparent border-0 p-0 text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-0 w-full"
                      placeholder={t("search.location_placeholder", "Casablanca, Rabat...")}
                      onChange={HandleChangeData}
                    />
                  </div>
                </div>

                {/* Doctor Name Input — filter by practitioner's first name */}
                <div className="flex-1 flex items-center px-6 py-4 bg-slate-50 rounded-[2rem] border border-transparent focus-within:border-brand-200 focus-within:bg-white transition-all group">
                  <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 mr-3" />
                  <div className="flex flex-col text-left w-full">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t("search.doctor_name", "Doctor Name")}</label>
                    <input
                      name="firstname"
                      type="text"
                      className="bg-transparent border-0 p-0 text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-0 w-full"
                      placeholder={t("search.doctor_name_placeholder", "Dr. Smith...")}
                      onChange={HandleChangeData}
                    />
                  </div>
                </div>

                {/* Hospital Input — filter by clinic/hospital/facility name */}
                <div className="flex-1 flex items-center px-6 py-4 bg-slate-50 rounded-[2rem] border border-transparent focus-within:border-brand-200 focus-within:bg-white transition-all group">
                  <BuildingOffice2Icon className="w-5 h-5 text-slate-400 group-focus-within:text-brand-500 mr-3" />
                  <div className="flex flex-col text-left w-full">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t("search.facility", "Facility")}</label>
                    <input
                      name="nom_cabinet"
                      type="text"
                      className="bg-transparent border-0 p-0 text-sm font-bold text-slate-900 placeholder-slate-400 focus:ring-0 w-full"
                      placeholder={t("search.facility_placeholder", "Clinic name...")}
                      onChange={HandleChangeData}
                    />
                  </div>
                </div>

                <button className="lg:ml-3 px-10 py-5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-[2rem] shadow-premium shadow-brand-200/50 transition-all active:scale-95 flex items-center justify-center">
                  <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                  {t("search.search", "Search")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section — renders a grid of SearchDoctorCard components, a spinner while loading, or an empty-state message */}
      <main className="container mx-auto px-4 py-16 flex-grow">
        {Loading ? (
          <div className="w-full flex flex-col items-center justify-center py-20">
            <Spinner />
            <p className="text-slate-500 font-bold mt-4 animate-pulse uppercase tracking-widest text-xs">{t("search.finding_matches", "Finding matches...")}</p>
          </div>
        ) : (
          <>
            {DataSearch.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DataSearch.map((info, idx) => (
                  <SearchDoctorCard
                    key={idx}
                    name={info.firstname + " " + info.lastname}
                    id={info.id}
                    day_debut_work={info.day_debut_work}
                    day_fin_work={info.day_fin_work}
                    specialite={info.specialite}
                    available={info.available}
                    avatar_doctor={info.avatar_doctor}
                    time_debut_work={info.time_debut_work}
                    time_fin_work={info.time_fin_work}
                    address_cabinet={info.address_cabinet}
                    rating={info.reviews_avg_rating ? parseFloat(info.reviews_avg_rating) : null}
                    reviews_count={info.reviews_count || 0}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-premium">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <MagnifyingGlassIcon className="w-12 h-12 text-slate-200" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{t("search.no_doctors", "No doctors found")}</h3>
                <p className="text-slate-500 mt-2 max-w-sm text-center">
                  {t("search.no_doctors_desc", "Try adjusting your filters or search keywords to find your healthcare provider.")}
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-8 text-brand-600 font-bold text-sm hover:underline"
                >
                  {t("search.clear_filters", "Clear all filters")}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
      <AlertToRegistre
        showAlertToRegistre={showAlertToRegistre}
        setSowAlertToRegistre={setSowAlertToRegistre}
      />
    </div>
  );
};

export default SearchDoctors;

