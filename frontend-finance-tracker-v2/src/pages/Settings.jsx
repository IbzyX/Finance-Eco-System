import { Link, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./css/Settings.css";

export default function Settings() {
    const { isAuthenticated, isLoading, logout } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" />;
  return (
    <section>
        <h1>Settings</h1>
        <div className="container">
        <div className="settings-wrapper">
          <aside className="sidebar">
            <h2>Profile</h2>
            <button className="sidebar-btn">Manage Profile</button>
            <button className="sidebar-btn">Input Type</button>

            <div className="divider"></div>
            
            <h2>Links</h2>
            <Link to="" className="logout">Stock News Feed</Link>
            <div className="divider"></div>

            <h2>General</h2>
            <button className="sidebar-btn">Theme</button>

            <button onClick={() => logout({ returnTo: window.location.origin })} className="logout">
              Logout
            </button>
            
            
          </aside>
          <main className="content-area"></main>
        </div>
      </div>
    </section>


  );
}
