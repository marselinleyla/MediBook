import React, { useEffect, useMemo, useRef } from "react";
import Datepicker from "flowbite-datepicker/Datepicker";
import { useTranslation } from "react-i18next";

const dayIndex = {
  dimanche: 0, lundi: 1, mardi: 2, mercredi: 3,
  jeudi: 4, vendredi: 5, samedi: 6,
};

const normalizeDay = (val) => {
  if (!val) return "";
  let s = val.toLowerCase().trim();
  s = s.replace(/[éèêë]/g, "e");
  s = s.replace(/[àâä]/g, "a");
  s = s.replace(/[ûùü]/g, "u");
  s = s.replace(/[ôö]/g, "o");
  s = s.replace(/[îï]/g, "i");
  s = s.replace(/ç/g, "c");
  return s;
};

/*
 * DataPicker.jsx — Date picker input using flowbite-datepicker
 * Props:
 *   - setSelectedDate : function(dateString) — called when a date is chosen
 *   - dayDebutWork    : string — doctor's first working day (French, e.g. "lundi")
 *   - dayFinWork      : string — doctor's last working day (French, e.g. "vendredi")
 */
const DatePicker = ({ setSelectedDate, dayDebutWork, dayFinWork }) => {
  const { t } = useTranslation();
  const dpRef = useRef(null);

  const disabledDays = useMemo(() => {
    if (!dayDebutWork || !dayFinWork) return [];

    const debutRaw = normalizeDay(dayDebutWork);
    const finRaw = normalizeDay(dayFinWork);
    const debut = dayIndex[debutRaw];
    const fin = dayIndex[finRaw];
    if (debut === undefined || fin === undefined) return [];

    const workingDays = new Set();
    if (debut <= fin) {
      for (let i = debut; i <= fin; i++) workingDays.add(i);
    } else {
      for (let i = debut; i <= 6; i++) workingDays.add(i);
      for (let i = 0; i <= fin; i++) workingDays.add(i);
    }

    const disabled = [];
    for (let i = 0; i <= 6; i++) {
      if (!workingDays.has(i)) disabled.push(i);
    }
    return disabled;
  }, [dayDebutWork, dayFinWork]);

  useEffect(() => {
    const datepickerEl = document.getElementById("datepickerId");
    if (!datepickerEl) return;
    try { dpRef.current?.destroy(); } catch (e) {}

    const dp = new Datepicker(datepickerEl, {
      autohide: true,
      format: "dd/mm/yyyy",
      daysOfWeekDisabled: disabledDays,
      minDate: new Date(),
    });
    dpRef.current = dp;

    const handler = () => {
      const val = datepickerEl.value;
      if (val) {
        setSelectedDate(val);
      }
    };

    datepickerEl.addEventListener("changeDate", handler);
    return () => {
      datepickerEl.removeEventListener("changeDate", handler);
      if (datepickerEl.isConnected) {
        dp.destroy();
      }
    };
  }, [setSelectedDate, disabledDays]);

  return (
    <div className="relative w-full">
      <input
        datepicker="true"
        datepicker-autohide="true"
        type="text"
        className="w-full bg-slate-50 border-2 border-slate-100 text-slate-900 text-sm font-bold rounded-2xl focus:ring-brand-500 focus:border-brand-500 block pl-12 pr-4 py-3.5 transition-all placeholder-slate-400 group-hover:bg-white"
        placeholder={t("common.select_date")}
        id="datepickerId"
        autoComplete="off"
        readOnly
      />
    </div>
  );
};

export default DatePicker;
