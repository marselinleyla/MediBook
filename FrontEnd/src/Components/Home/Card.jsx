import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/*
 * Card.jsx — Doctor profile card used in the home page grid
 * Props:
 *   - id        : number — doctor ID, used in navigation links
 *   - img       : string — avatar image path (relative or URL)
 *   - name      : string — doctor's full name
 *   - specialite: string — doctor's specialty
 * getImageUrl(imagePath): resolves image paths — returns a default
 *   placeholder if empty, passes through absolute URLs, or prepends
 *   the storage base URL for relative paths.
 * Renders a card with a hover-zoom image, name, specialty label, and
 * two action buttons: "Reserve" (links to bookingappointment/{id}) and
 * "View Profile" (links to /doctor/View_Profile/{id}).
 */
const Card = ({ id, img, name, specialite }) => {
  const { t } = useTranslation();

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/img/doctors/doctor-default-avatar.png";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
      return imagePath;
    }
    return `http://localhost:8000/storage/images/doctors/${imagePath}`;
  };

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-premium hover:shadow-premium-hover transition-all duration-300 flex flex-col h-full" key={id}>
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={getImageUrl(img)}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-600 transition-colors">
          {name}
        </h3>
        <p className="text-sm font-medium text-brand-500 mb-6">
          {specialite}
        </p>
        
        <div className="mt-auto grid grid-cols-2 gap-3">
          <Link 
            to={"/bookingappointment/" + id}
            className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-[12px] font-bold uppercase tracking-wider rounded-xl text-center shadow-sm active:scale-[0.98] transition-all"
          >
            {t("common.reserve")}
          </Link>
          <Link 
            to={"/doctor/View_Profile/" + id}
            className="px-4 py-2.5 border border-slate-200 hover:border-brand-600 hover:text-brand-600 text-slate-600 text-[12px] font-bold uppercase tracking-wider rounded-xl text-center transition-all bg-white"
          >
            {t("common.view_profile")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;

