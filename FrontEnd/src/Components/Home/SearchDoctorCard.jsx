import React from "react";
import { ClockIcon, StarIcon as StarIconOutline, CheckBadgeIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/*
 * SearchDoctorCard.jsx — Doctor result card for the search/listing page
 * Props:
 *   - name, id, avatar_doctor, specialite, available
 *   - day_debut_work, day_fin_work, time_debut_work, time_fin_work
 *   - address_cabinet, rating, reviews_count
 * renderStars(rate): generates an array of star icons (solid for full,
 *   half for partial, outline for empty) representing the rating.
 * getImageUrl(imagePath): resolves doctor image paths, with fallback.
 * Renders a card with: availability badge, doctor image, name + rating
 * stars, specialty tag, working hours, address, and "View Profile" and
 * "Book Now" action buttons.
 */
const SearchDoctorCard = ({
  name,
  id,
  avatar_doctor,
  day_debut_work,
  day_fin_work,
  specialite,
  available,
  time_fin_work,
  time_debut_work,
  address_cabinet,
  rating,
  reviews_count,
}) => {
  const { t } = useTranslation();

  const renderStars = (rate) => {
    const stars = [];
    const full = Math.floor(rate);
    const hasHalf = rate - full >= 0.25;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(<StarIconSolid key={i} className="w-3 h-3 text-amber-500" />);
      } else if (i === full && hasHalf) {
        stars.push(
          <span key={i} className="relative">
            <StarIconOutline className="w-3 h-3 text-amber-300" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <StarIconSolid className="w-3 h-3 text-amber-500" />
            </span>
          </span>
        );
      } else {
        stars.push(<StarIconOutline key={i} className="w-3 h-3 text-amber-300" />);
      }
    }
    return stars;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/img/doctors/doctor-default-avatar.png";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
      return imagePath;
    }
    return `http://localhost:8000/storage/images/doctors/${imagePath}`;
  };

  return (
    <div className="group bg-white rounded-[2.5rem] p-5 shadow-premium hover:shadow-2xl transition-all duration-500 border border-slate-50 relative overflow-hidden flex flex-col h-full">
      {/* Availability Badge */}
      <div className="absolute top-8 right-8 z-10">
        {available === "1" ? (
          <div className="flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 backdrop-blur-md">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{t("common.available")}</span>
          </div>
        ) : (
          <div className="flex items-center px-3 py-1 bg-slate-50 text-slate-400 rounded-full border border-slate-100">
            <span className="h-2 w-2 bg-slate-300 rounded-full mr-2"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider">{t("common.not_available")}</span>
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] bg-slate-100 mb-6">
        <img
          src={getImageUrl(avatar_doctor)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          alt={name}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content Section */}
      <div className="flex-grow flex flex-col px-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center text-brand-600 text-[10px] font-bold uppercase tracking-widest mb-1">
              <CheckBadgeIcon className="w-3 h-3 mr-1" />
              {t("doctor.verified_expert", "Verified Expert")}
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
              Dr. {name}
            </h3>
          </div>
          <div className="flex items-center bg-amber-50 px-2 py-1 rounded-lg gap-0.5">
            {renderStars(rating || 0)}
            <span className="text-[10px] font-bold text-amber-700 ml-1">{rating ? rating.toFixed(1) : "—"}</span>
          </div>
        </div>

        <p className="text-slate-500 text-sm font-medium mb-4 flex items-center">
          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-bold mr-2 uppercase tracking-wider">
            {specialite}
          </span>
        </p>

        <div className="space-y-2 mt-auto pb-6 border-b border-slate-50">
          <div className="flex items-center text-slate-500 text-[13px] font-medium">
            <ClockIcon className="h-4 w-4 text-brand-500 mr-2" />
            <span>{day_debut_work}-{day_fin_work} • {time_debut_work}-{time_fin_work}</span>
          </div>
          <div className="flex items-center text-slate-500 text-[13px] font-medium">
            <MapPinIcon className="h-4 w-4 text-brand-500 mr-2" />
            <span>{address_cabinet || t("doctor.location")}</span>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="grid grid-cols-2 gap-3 mt-6">
        <Link to={`/doctor/View_Profile/${id}`} className="w-full">
          <button className="w-full py-3.5 px-4 text-brand-600 bg-white border-2 border-brand-50 hover:bg-brand-50 hover:border-brand-100 rounded-2xl font-bold text-xs transition-all duration-300">
            {t("common.view_profile")}
          </button>
        </Link>
        {available === "1" ? (
          <Link to={`/bookingappointment/${id}`} className="w-full">
            <button className="w-full py-3.5 px-4 text-white bg-brand-600 hover:bg-brand-700 shadow-premium shadow-brand-200/50 rounded-2xl font-bold text-xs transition-all duration-300">
              {t("common.book_now")}
            </button>
          </Link>
        ) : (
          <button
            disabled
            className="w-full py-3.5 px-4 text-slate-400 bg-slate-100 rounded-2xl font-bold text-xs cursor-not-allowed transition-all duration-300"
          >
            {t("common.not_available", "Not Available")}
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchDoctorCard;

