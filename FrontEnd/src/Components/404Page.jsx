import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

/*
 * 404Page.jsx — 404 Not Found page component
 * Renders a 404 error page with an animated GIF and a "Go Back" button
 * that navigates users to the home page ("/"). Sets the document title
 * to the translated "not found" string on mount.
 */
const PageNotfond = () => {
  const { t } = useTranslation();
  
  /* Set the browser tab title to the translated 404 message */
  useEffect(() => {
    document.title = t("errors.not_found");
  }, [t]);

  return (
    <>
      {/* 404 animated illustration */}
      <div className="  flex justify-center items-center ">
        <img src="/img/36395-lonely-404.gif" alt="404" />
      </div>
      {/* "Go back" button linking to the homepage */}
      <div className="  absolute  " style={{ top: "64%", left: "46%" }}>
        <Link to={"/"}>
          <button className="px-4 py-2 mt-4 text-lg text-gray-600 transition-colors duration-300 transform border rounded-lg hover:bg-gray-100 focus:outline-none">
            {t("errors.go_back")}
          </button>
        </Link>

      </div>
    </>
  );
};

export default PageNotfond;
