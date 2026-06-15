import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

/*
 * SelelctLang.jsx — Language selector dropdown component
 * State:
 *   - Toggle : boolean — controls dropdown open/close
 * Uses a ref to detect clicks outside the dropdown and auto-close it.
 * locales: maps language codes ("en", "fr", "ar") to display names.
 * Renders a button showing the current language code and a chevron;
 * when open, shows a dropdown with all available languages. Clicking
 * one calls i18n.changeLanguage() and closes the dropdown.
 */
const SelelctLang = () => {
  const [Toggle, setToggle] = useState(false);
  const dropdownRef = useRef(null);
  const { i18n } = useTranslation();

  const locales = {
    en: "English",
    fr: "Français",
    ar: "العربية",
  };

  /* Close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setToggle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex-shrink-0 z-10 uppercase inline-flex items-center px-3 py-1.5 text-[12px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all duration-200 shadow-sm"
        type="button"
        onClick={() => setToggle(!Toggle)}
      >
        <span className="mr-2">{i18n.resolvedLanguage}</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${Toggle ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {Toggle && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-2xl shadow-premium border border-slate-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[110]">
          <ul className="text-[13px] text-slate-600">
            {Object.keys(locales).map((val) => (
              <li key={val}>
                <button
                  onClick={() => {
                    i18n.changeLanguage(val);
                    setToggle(false);
                  }}
                  type="button"
                  className={`flex items-center w-full px-4 py-2 hover:bg-brand-50 hover:text-brand-600 transition-colors ${
                    i18n.resolvedLanguage === val ? "text-brand-600 font-bold bg-brand-50/50" : ""
                  }`}
                >
                  <span className="uppercase mr-2">{val}</span>
                  <span className="text-[11px] opacity-60 font-normal">{locales[val]}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SelelctLang;

