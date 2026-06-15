import React, { useState, useEffect } from 'react';
import axiosClient from "../AxiosClient";
import { useParams, Link } from "react-router-dom";
import { Footer, Header } from "../Components";
import { useSelector } from "react-redux";
import GetAuthUser from "../hooks/GetAuthUser";
import { useTranslation } from "react-i18next";
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  PhoneIcon, 
  BuildingOfficeIcon,
  StarIcon as StarIconOutline,
  CheckBadgeIcon,
  CalendarDaysIcon,
  ShareIcon,
  PhotoIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";

/*
 * DoctorPage — Full doctor profile page (public)
 * Fetches and displays a doctor's profile, gallery images, and patient reviews.
 * Allows authenticated users to submit reviews and share the page.
 * State:
 *   doctor — full doctor profile object from API
 *   galleryImages — array of gallery image records
 *   reviews — array of patient reviews
 *   reviewForm — { rating, comment } for the review submission form
 *   submitting / loading — spinner flags
 *   copied — clipboard share feedback
 * API calls:
 *   GET /api/doctor_view/:id  — doctor profile
 *   GET /api/doctor/gallery/:id — gallery images
 *   GET /api/doctor/reviews/:id — reviews list
 *   POST /api/review/submit — submit a new review (authenticated)
 */
const DoctorPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const user = useSelector((state) => state.authUser?.user);
  GetAuthUser();
  const [doctor, setDoctor] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  /* Builds a full URL for doctor avatar images */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/img/doctors/doctor-default-avatar.png";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
      return imagePath;
    }
    return `http://localhost:8000/storage/images/doctors/${imagePath}`;
  };

  /* Builds a full URL for gallery images */
  const getGalleryImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `http://localhost:8000/storage/images/doctors/gallery/${imagePath}`;
  };

  /* Renders star icons for a given rating (supports half stars) */
  const renderStars = (rate, size = "w-4 h-4") => {
    if (!rate) return null;
    const stars = [];
    const full = Math.floor(rate);
    const hasHalf = rate - full >= 0.25;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(<StarIconSolid key={i} className={`${size} text-amber-500`} />);
      } else if (i === full && hasHalf) {
        stars.push(
          <span key={i} className="relative inline-block">
            <StarIconOutline className={`${size} text-amber-300`} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
              <StarIconSolid className={`${size} text-amber-500`} />
            </span>
          </span>
        );
      } else {
        stars.push(<StarIconOutline key={i} className={`${size} text-amber-300`} />);
      }
    }
    return stars;
  };

  /* Fetches doctor profile, gallery, and reviews on mount (or id change) */
  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        setLoading(true);
        const [profileRes, galleryRes, reviewsRes] = await Promise.all([
          axiosClient.get(`/doctor_view/${id}`),
          axiosClient.get(`/doctor/gallery/${id}`),
          axiosClient.get(`/doctor/reviews/${id}`),
        ]);
        setDoctor(profileRes.data);
        setGalleryImages(galleryRes.data);
        setReviews(reviewsRes.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [id]);

  /* Submits a patient review, then re-fetches reviews and profile to refresh data */
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const res = await axiosClient.post("/review/submit", {
        doctor_id: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviewForm({ rating: 5, comment: "" });
      const reviewsRes = await axiosClient.get(`/doctor/reviews/${id}`);
      setReviews(reviewsRes.data);
      const profileRes = await axiosClient.get(`/doctor_view/${id}`);
      setDoctor(profileRes.data);
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  /* Copies the current page URL to the clipboard, shows "Copied!" feedback for 2s */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  /* Full-page loading spinner */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-xs animate-pulse">{t("doctor_profile.consulting_record")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col">
      <Header />
      
      <main className="flex-grow pt-8 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Section — cover gradient, share button, profile card overlay with doctor info */}
          <div className="relative mb-12">
            <div className="h-64 w-full rounded-[3rem] bg-gradient-to-br from-brand-600 to-medical-500 shadow-premium overflow-hidden relative">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
               <div className="absolute top-8 right-8 flex gap-3">
                   <button
                     onClick={handleShare}
                     className="p-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl text-white transition-all"
                     title={copied ? t("doctor_profile.copied", "Copied!") : t("doctor_profile.share", "Share profile")}
                   >
                     {copied ? (
                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                     ) : (
                       <ShareIcon className="w-5 h-5" />
                     )}
                    </button>
               </div>
            </div>
 
            {/* Profile Card Overlay */}
            <div className="max-w-5xl mx-auto px-8 relative -mt-32">
              <div className="bg-white rounded-[3rem] shadow-premium p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row items-center md:items-start gap-10">
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 bg-gradient-to-tr from-brand-600 to-medical-400 rounded-full blur opacity-20 animate-spin-slow"></div>
                  <img 
                    src={getImageUrl(doctor?.avatar_doctor)} 
                    alt={t("doctor_profile.doctor_alt")} 
                    className="w-48 h-48 rounded-[2.5rem] object-cover relative ring-4 ring-white shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg border-4 border-white">
                    <CheckBadgeIcon className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex-grow text-center md:text-left pt-4">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-bold uppercase tracking-widest border border-brand-100">
                      {t("doctor_profile.top_rated")}
                    </span>
                    <div className="flex items-center text-amber-500">
                       {doctor?.reviews_avg_rating ? renderStars(doctor.reviews_avg_rating) : (
                         <>
                           <StarIconOutline className="w-4 h-4 text-amber-300" />
                           <StarIconOutline className="w-4 h-4 text-amber-300" />
                           <StarIconOutline className="w-4 h-4 text-amber-300" />
                           <StarIconOutline className="w-4 h-4 text-amber-300" />
                           <StarIconOutline className="w-4 h-4 text-amber-300" />
                         </>
                       )}
                       <span className="ml-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                        {doctor?.reviews_avg_rating
                          ? `${parseFloat(doctor.reviews_avg_rating).toFixed(1)} (${doctor.reviews_count || 0})`
                          : t("doctor_profile.rating_out_of")}
                       </span>
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Dr. {doctor?.firstname} {doctor?.lastname}
                  </h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mt-8">
                     <div className="flex items-center text-slate-600 group">
                        <div className="p-2.5 bg-slate-50 rounded-xl mr-4 group-hover:bg-brand-50 transition-colors">
                          <BriefcaseIcon className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t("doctor_profile.specialization")}</p>
                          <p className="text-sm font-bold text-slate-800">{doctor?.specialite}</p>
                        </div>
                     </div>

                     <div className="flex items-center text-slate-600 group">
                        <div className="p-2.5 bg-slate-50 rounded-xl mr-4 group-hover:bg-brand-50 transition-colors">
                          <BuildingOfficeIcon className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t("doctor_profile.clinic_name")}</p>
                          <p className="text-sm font-bold text-slate-800">{doctor?.nom_cabinet}</p>
                        </div>
                     </div>

                     <div className="flex items-center text-slate-600 group">
                        <div className="p-2.5 bg-slate-50 rounded-xl mr-4 group-hover:bg-brand-50 transition-colors">
                          <MapPinIcon className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t("doctor_profile.location")}</p>
                          <p className="text-sm font-bold text-slate-800">{doctor?.address_cabinet}</p>
                        </div>
                     </div>

                     <div className="flex items-center text-slate-600 group">
                        <div className="p-2.5 bg-slate-50 rounded-xl mr-4 group-hover:bg-brand-50 transition-colors">
                          <PhoneIcon className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">{t("doctor_profile.contact_office")}</p>
                          <p className="text-sm font-bold text-slate-800">{doctor?.phoneNumber}</p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-12 flex flex-col sm:flex-row gap-4">
                    {doctor?.available === "1" ? (
                      <Link 
                        to={`/bookingappointment/${id}`}
                        className="inline-flex items-center justify-center px-10 py-5 bg-brand-600 text-white font-bold text-sm rounded-[1.5rem] hover:bg-brand-700 shadow-premium shadow-brand-200/50 transition-all active:scale-95 group"
                      >
                        <CalendarDaysIcon className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
                        {t("doctor_profile.book_appointment")}
                      </Link>
                    ) : (
                      <button
                        disabled
                        className="inline-flex items-center justify-center px-10 py-5 bg-slate-100 text-slate-400 font-bold text-sm rounded-[1.5rem] cursor-not-allowed transition-all"
                      >
                        <CalendarDaysIcon className="w-5 h-5 mr-3" />
                        {t("common.not_available", "Not Available")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Content — main content (2/3) and sidebar (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:col-span-2 space-y-12">
               {/* About Section — doctor's biography / professional description */}
               <section>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center">
                     {t("doctor_profile.professional_biography")}
                     <div className="h-1 flex-grow bg-slate-100 ml-6 rounded-full opacity-50"></div>
                  </h2>
                  <div className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-premium leading-relaxed text-slate-600 text-lg">
                     {doctor?.about || t("doctor_profile.no_bio")}
                  </div>
               </section>

               {/* Gallery Section — image grid of the doctor's medical office / facility */}
               <section>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center">
                     {t("doctor_profile.medical_gallery")}
                     <div className="h-1 flex-grow bg-slate-100 ml-6 rounded-full opacity-50"></div>
                  </h2>
                 {galleryImages.length === 0 ? (
                   <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-premium text-center">
                     <PhotoIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                     <p className="text-sm font-bold text-slate-400">{t("gallery.no_images_public", "No gallery images available yet.")}</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {galleryImages.map((img) => (
                       <div key={img.id} className="group overflow-hidden rounded-[2.5rem] relative aspect-video shadow-lg">
                         <img
                           src={getGalleryImageUrl(img.image_path)}
                           alt={t("doctor_profile.medical_office_alt")}
                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                         />
                         <div className="absolute inset-0 bg-brand-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                            <span className="text-white font-bold uppercase tracking-widest text-[10px] bg-white/20 px-4 py-2 rounded-full border border-white/30">{t("doctor_profile.view_image")}</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </section>
                 {/* Reviews Section — list of patient reviews with average rating */}
                <section>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-6 flex items-center">
                     {t("doctor_profile.reviews_title", "Patient Reviews")}
                     <div className="h-1 flex-grow bg-slate-100 ml-6 rounded-full opacity-50"></div>
                  </h2>

                  {/* Submit Review — star rating + comment textarea, visible only to authenticated users */}
                  {user ? (
                    <form onSubmit={handleSubmitReview} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium mb-8">
                      <h3 className="text-sm font-bold text-slate-900 mb-4">{t("doctor_profile.leave_review", "Leave a Review")}</h3>
                      <div className="flex items-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: star })}>
                            {star <= reviewForm.rating ? (
                              <StarIconSolid className="w-7 h-7 text-amber-500 hover:scale-110 transition-transform" />
                            ) : (
                              <StarIconOutline className="w-7 h-7 text-slate-300 hover:text-amber-400 hover:scale-110 transition-all" />
                            )}
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder={t("doctor_profile.review_placeholder", "Share your experience...")}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-sm font-medium text-slate-900 focus:ring-brand-500 focus:border-brand-500 transition-all resize-none mb-4"
                        rows="3"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3 bg-brand-600 text-white font-bold text-xs rounded-[1.5rem] hover:bg-brand-700 transition-all disabled:opacity-60"
                      >
                        {submitting ? t("gallery.uploading", "Submitting...") : t("doctor_profile.submit_review", "Submit Review")}
                      </button>
                    </form>
                  ) : (
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium mb-8 text-center">
                      <p className="text-sm font-medium text-slate-500">
                        <Link to="/Connexion" className="text-brand-600 font-bold hover:underline">{t("navbar.login")}</Link>
                        {" "}{t("doctor_profile.to_leave_review", "to leave a review")}
                      </p>
                    </div>
                  )}

                  {/* Reviews List — maps over reviews array, or shows empty state */}
                  {reviews.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] p-12 border border-slate-100 shadow-premium text-center">
                      <UserCircleIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <p className="text-sm font-bold text-slate-400">{t("doctor_profile.no_reviews", "No reviews yet.")}</p>
                      <p className="text-[10px] font-medium text-slate-300 uppercase tracking-widest mt-1">{t("doctor_profile.be_first", "Be the first to review")}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-premium">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                                <UserCircleIcon className="w-6 h-6 text-brand-500" />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{review.user?.firstname} {review.user?.lastname}</p>
                                <p className="text-[10px] text-slate-400 font-medium">{new Date(review.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                              {renderStars(review.rating, "w-3.5 h-3.5")}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
               </section>
             </div>

              {/* Sidebar — working hours widget, weekday schedule, emergency contact card */}
              <div className="lg:col-span-1 space-y-8">
                 {/* Working Hours Widget — sticky card showing Mon-Fri hours, weekend closed, emergency contact */}
               <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-premium sticky top-24">
                   <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">{t("doctor_profile.service_availability")}</h3>
                  
                  <div className="space-y-4">
                     {[t("doctor_profile.monday"), t("doctor_profile.tuesday"), t("doctor_profile.wednesday"), t("doctor_profile.thursday"), t("doctor_profile.friday")].map((day) => (
                       <div key={day} className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 group">
                         <span className="text-sm font-bold text-slate-500 group-hover:text-brand-600 transition-colors">{day}</span>
                         <span className="text-xs font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 group-hover:bg-brand-50 group-hover:border-brand-100 transition-all">09:00 - 18:00</span>
                       </div>
                     ))}
                     <div className="flex justify-between items-center py-4 border-b border-slate-50 last:border-0 opacity-50">
                       <span className="text-sm font-bold text-slate-400 italic">{t("doctor_profile.weekend")}</span>
                       <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">{t("doctor_profile.closed")}</span>
                     </div>
                  </div>

                  <div className="mt-10 p-6 bg-brand-600 rounded-3xl text-white shadow-xl shadow-brand-200 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mt-10 -mr-10"></div>
                     <p className="text-xs font-bold uppercase tracking-widest text-white/70 mb-2">{t("doctor_profile.emergency_hub")}</p>
                     <p className="text-lg font-black leading-tight mb-4 tracking-tight">{t("doctor_profile.emergency_text")}</p>
                     <p className="text-[22px] font-black tracking-tighter tabular-nums">+212 522-88-99-00</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DoctorPage;
