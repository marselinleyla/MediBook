/* ============================================================
 * usePageTitle.js – Custom hook that sets the document <title>
 * to a translated string.
 *
 * Accepts a translation key and an optional fallback string.
 * The title is updated whenever the language, key, or fallback
 * changes.
 * ============================================================ */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export function usePageTitle(key, fallback) {
  const { t } = useTranslation();

  useEffect(() => {
    // Set the browser tab title to the translated value
    document.title = t(key, fallback);
  }, [t, key, fallback]);
}

export default usePageTitle;
