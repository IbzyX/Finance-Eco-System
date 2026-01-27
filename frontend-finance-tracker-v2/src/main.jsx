import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

import App from "./App.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashbaordEdit from "./pages/DashboardEdit.jsx";
import Settings from "./pages/Settings.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Entry from "./pages/EntryForm.jsx";
import Hybrid from "./pages/HybridInput.jsx";
import TrueLayerCallback from "./pages/TrueLayerCallback.jsx";

import "./index.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboardEdit", element: <DashbaordEdit /> },
      { path: "/entry", element:< Entry /> },
      { path: "/hybrid", element:< Hybrid /> },
      { path: "/settings", element: <Settings /> },
      { path: "/truelayer/callback", element: <TrueLayerCallback /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://finance-tracker-api/",
      scope: "openid profile email "
    }}
    onRedirectCallback={(appState) => {
      const returnTo = appState?.returnTo || window.location.pathname;
      window.history.replaceState({}, document.title, returnTo);
    }}


    cacheLocation="localstorage"
    useRefreshTokens={true}
  >
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Auth0Provider>
);
