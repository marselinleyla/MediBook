import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/*
 * Footer.jsx — Application footer component
 * Props:
 *   - colorText : "white" | default — controls text color for light/dark
 *     footer backgrounds. When "white", uses white text (for dark bg).
 * Renders a 4-column footer grid: Brand (logo + description), Platform
 * links, Support links, and a "Stay Connected" section with social icons.
 * Includes a bottom bar with copyright, Status, Contact, and Privacy links.
 */
const Footer = ({ colorText }) => {
  const { t } = useTranslation();
  const textColor = colorText === "white" ? "text-white" : "text-slate-600";
  const headingColor = colorText === "white" ? "text-white" : "text-slate-900";

  return (
    <footer className={`bg-${colorText === "white" ? "transparent" : "slate-50"} border-t border-slate-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <span className={`text-xl font-bold ${headingColor} tracking-tight`}>
                Medi<span className="text-brand-600">Book</span>
              </span>
            </Link>
            <p className={`text-sm ${textColor} leading-relaxed max-w-xs`}>
              {t("home.footer_desc", "Making healthcare accessible and convenient for everyone. Book your appointments with top doctors in seconds.")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-sm font-bold ${headingColor} uppercase tracking-wider mb-4`}>{t("home.platform", "Platform")}</h4>
            <ul className="space-y-2">
              <li><Link to="/recherche" className={`text-sm ${textColor} hover:text-brand-600 transition-colors`}>{t("navbar.find_doctor")}</Link></li>
              <li><Link to="/about" className={`text-sm ${textColor} hover:text-brand-600 transition-colors`}>{t("navbar.about")}</Link></li>
              <li><Link to="/contact" className={`text-sm ${textColor} hover:text-brand-600 transition-colors`}>{t("navbar.contact")}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className={`text-sm font-bold ${headingColor} uppercase tracking-wider mb-4`}>{t("home.support", "Support")}</h4>
            <ul className="space-y-2">
              <li><Link to="#" className={`text-sm ${textColor} hover:text-brand-600 transition-colors`}>{t("home.faq", "F.A.Q")}</Link></li>
              <li><Link to="#" className={`text-sm ${textColor} hover:text-brand-600 transition-colors`}>{t("home.privacy_policy", "Privacy Policy")}</Link></li>
              <li><Link to="#" className={`text-sm ${textColor} hover:text-brand-600 transition-colors`}>{t("home.terms_of_service", "Terms of Service")}</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className={`text-sm font-bold ${headingColor} uppercase tracking-wider mb-4`}>{t("home.stay_connected", "Stay Connected")}</h4>
            <div className="flex space-x-4">
              <span className={`p-2 rounded-lg bg-white shadow-sm border border-slate-100 ${textColor} hover:text-brand-600 cursor-pointer transition-all`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </span>
              <span className={`p-2 rounded-lg bg-white shadow-sm border border-slate-100 ${textColor} hover:text-brand-600 cursor-pointer transition-all`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.063 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.063-1.366.333-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.28-.058-1.689-.072-4.948-.072zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-center md:text-left">
          <p className={`text-sm ${textColor}`}>
             {t('common.copyright')} 
          </p>
          <div className="flex space-x-6">
            <Link to="#" className={`text-xs ${textColor} hover:text-brand-600 transition-colors uppercase tracking-widest font-semibold`}>{t("home.status", "Status")}</Link>
            <Link to="#" className={`text-xs ${textColor} hover:text-brand-600 transition-colors uppercase tracking-widest font-semibold`}>{t("navbar.contact")}</Link>
            <Link to="#" className={`text-xs ${textColor} hover:text-brand-600 transition-colors uppercase tracking-widest font-semibold`}>{t("home.privacy", "Privacy")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

