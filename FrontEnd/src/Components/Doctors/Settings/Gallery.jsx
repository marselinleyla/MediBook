import React, { useEffect, useState } from "react";
import GetAuthDoctor from "../../../hooks/GetAuthDoctor";
import { useSelector } from "react-redux";
import axiosClient from "../../../AxiosClient";
import { useTranslation } from "react-i18next";
import { PhotoIcon, TrashIcon, CloudArrowUpIcon, XCircleIcon } from "@heroicons/react/24/outline";

/*
 * Gallery.jsx — Doctor's medical image gallery manager
 * State:
 *   - images   : array — list of gallery image records from the API
 *   - uploading: boolean — true while an image is being uploaded
 *   - loading  : boolean — true during initial gallery fetch
 * fetchGallery(): GETs the doctor's gallery images by doctor ID.
 * handleUpload(e): reads the selected file, POSTs it as FormData to
 *   /doctor/gallery/upload, then refreshes the gallery.
 * handleDelete(imageId): DELETEs an image by ID, then refreshes.
 * getImageUrl(imagePath): builds the full URL for a stored image.
 * Renders a drag-and-drop upload area and a responsive grid of images
 * with hover delete overlay.
 */
const Gallery = () => {
  const { t } = useTranslation();
  const doctorData = useSelector((state) => state.AuthDoctor);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  GetAuthDoctor();

  /* Fetch gallery images for the authenticated doctor */
  const fetchGallery = () => {
    if (!doctorData.doctor) return;
    setLoading(true);
    axiosClient
      .get(`/doctor/gallery/${doctorData.doctor.id}`)
      .then((res) => {
        setImages(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  /* Fetch gallery on mount when doctor data becomes available */
  useEffect(() => {
    if (doctorData.doctor) {
      fetchGallery();
    }
  }, [doctorData]);

  /* Upload a new image file to the gallery */
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("doctor_id", doctorData.doctor.id);
    formData.append("image", file);

    axiosClient
      .post("/doctor/gallery/upload", formData)
      .then(() => {
        setUploading(false);
        fetchGallery();
      })
      .catch(() => setUploading(false));
  };

  /* Delete an image from the gallery by its ID */
  const handleDelete = (imageId) => {
    axiosClient
      .delete(`/doctor/gallery/${imageId}`)
      .then(() => fetchGallery())
      .catch(console.error);
  };

  /* Build the full image URL from the stored path */
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    return `http://localhost:8000/storage/images/doctors/gallery/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Upload Area */}
      <div className="relative">
        <input
          type="file"
          id="galleryUpload"
          accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
          onChange={handleUpload}
          className="hidden"
        />
        <label
          htmlFor="galleryUpload"
          className={`flex flex-col items-center justify-center w-full py-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50 hover:bg-brand-50/50 hover:border-brand-300 cursor-pointer transition-all ${uploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t("gallery.uploading", "Uploading...")}</p>
            </div>
          ) : (
            <>
              <CloudArrowUpIcon className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-sm font-bold text-slate-500 mb-1">{t("gallery.drop_or_click", "Click or drag to upload images")}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">{t("gallery.format_hint", "JPG, PNG, WebP • Max 2 MB each")}</p>
            </>
          )}
        </label>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center py-16">
          <PhotoIcon className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-bold text-slate-400">{t("gallery.no_images", "No images in your gallery yet.")}</p>
          <p className="text-[10px] font-medium text-slate-300 uppercase tracking-widest mt-1">{t("gallery.upload_first", "Upload your first image above")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.id} className="group relative overflow-hidden rounded-[2rem] aspect-video shadow-lg border border-slate-100">
              <img
                src={getImageUrl(img.image_path)}
                alt={t("gallery.gallery_image", "Gallery Image")}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button
                  onClick={() => handleDelete(img.id)}
                  className="flex items-center px-4 py-2 bg-rose-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-rose-700 transition-all shadow-lg"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
                  {t("gallery.delete", "Delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
