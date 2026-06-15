import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileImg from "./ProfileImg";
import { useTranslation } from "react-i18next";
import SelelctLang from "./SelelctLang";
/* On page refresh, Redux loses the user profile object (user is set to null)
 * even though the auth token persists in localStorage. GetAuthUser detects
 * this case and re-fetches the user profile from the API, so the Header
 * always knows who's logged in without requiring a new login.            */
import GetAuthUser from "../../hooks/GetAuthUser";

/*
 * Header.jsx — Main site navigation header
 * State:
 *   - Toggle    : boolean — controls mobile menu open/close
 *   - isScrolled: boolean — true when page is scrolled > 20px,
 *     triggers backdrop-blur and compact padding (scroll effect)
 * Listens to window scroll events to toggle the isScrolled state
 * for the header's visual transition (transparent → frosted glass).
 * navLinks: array of { name, path } for Home, Find Doctor, About, Contact.
 * Desktop: logo, nav links, language selector, ProfileImg component.
 * Mobile: hamburger toggle → slide-down menu with nav links and ProfileImg.
 */
const Header = () => {
  const { t } = useTranslation();
  GetAuthUser(); /* Re-fetches user profile from API after page refresh */
  const [Toggle, setToggle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("navbar.home"), path: "/" },
    { name: t("navbar.find_doctor"), path: "/recherche" },
    { name: t("navbar.about"), path: "/about" },
    { name: t("navbar.contact"), path: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? "bg-white/80 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex  items-start">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">
                Medi<span className="text-brand-600">Book</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-brand-600 ${
                  location.pathname === link.path ? "text-brand-600" : "text-slate-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Action Area */}
          <div className="hidden md:flex items-center space-x-4">
            <SelelctLang />
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <ProfileImg />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <SelelctLang />
            <button
              onClick={() => setToggle(!Toggle)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {Toggle ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl transition-all duration-300 transform ${
          Toggle ? "translate-y-0 opacity-100 visibility-visible" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setToggle(false)}
              className={`block px-3 py-4 text-base font-medium rounded-xl hover:bg-slate-50 ${
                location.pathname === link.path ? "text-brand-600 bg-brand-50" : "text-slate-600"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-slate-100 flex justify-center">
            <ProfileImg />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

