/* ============================================================
 * index.js – Application entry point.
 *
 * Wraps the entire app in a Redux <Provider> so all components
 * can access the global store, then renders the React Router
 * provider with the route configuration.
 * Also imports Tailwind CSS and the i18n initialisation script.
 * ============================================================ */

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import router from "./Routes/Routes";
import "./index.css";
import { Provider } from "react-redux";
import store from "./Redux/Store.jsx";
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  // </React.StrictMode>
);
