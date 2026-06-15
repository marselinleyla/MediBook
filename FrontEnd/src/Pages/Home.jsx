import React from "react";

import { Footer, Header, Section } from "../Components";
import { useTranslation } from "react-i18next";

import "../Assets/Css/HomeCss/Home.css";

/*
 * Home — Landing page (public)
 * Composes Header, Section (hero/search/content area), and Footer.
 * No local state or API calls; purely presentational layout.
 * Sets <title> to "MediBook" via i18n.
 */
export const Home = () => {
  const { t } = useTranslation();
  document.title = t("home.title", "MediBook");

  return (
    <>
      <Header />
      <Section />
      <Footer />
    </>
  );
};

export default Home;
