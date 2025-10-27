import React, { useState} from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "./css/Settings.css";
import ManageProfiles from "../components/settings/ManageProfile";
import InputType from "../components/settings/InputTypes";
import ChatbotHistory from "../components/settings/ChatBotHistory";
import Themes from "../components/settings/Themes";



export default function Settings() {
  const { isAuthenticated, isLoading, logout } = useAuth0();
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch(activeTab) {

      case "profile":
        return <ManageProfiles />;

      case "input":
        return <InputType />;

      case "themes":
        return <Themes />;

      case "chatbotHistory":
        return <ChatbotHistory />;
      
      
        default:
        return <ManageProfiles />;
    }
  };



  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" />;

  return (
    <section>
      <h1>Settings</h1>
      <div className="container">
        <div className="settings-wrapper">

          <aside className="sidebar">
            <h2>Profile</h2>


            <button
              className="sidebar-btn"
              style={activeTab === "profile" ? activeButtonStyle : buttonStyle}
              onClick={() => setActiveTab("profile")}
            >
              Manage Profile
            </button>
            <button
              className="sidebar-btn"
              style={activeTab === "input" ? activeButtonStyle : buttonStyle}
              onClick={() => setActiveTab("input")}
            >
              Input Type
            </button>
            <div className="divider"></div>



            <h2>Links</h2>
            <Link to="" className="logout">
              Stock News Feed
            </Link>
            <div className="divider"></div>



            <h2>General</h2>
            <button
              className="sidebar-btn"
              style={activeTab === "themes" ? activeButtonStyle : buttonStyle}
              onClick={() => setActiveTab("themes")}
            >
              Theme
            </button>
            <button
              className="sidebar-btn"
              style={activeTab === "chatbotHistory" ? activeButtonStyle : buttonStyle}
              onClick={() => setActiveTab("chatbotHistory")}
            >
              AI Chatbot History
            </button>
            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="logout"
            >
              Logout
            </button>
          </aside>

          {/* Dynamic content */}
          <main className="content-area">{renderContent()}</main>
        </div>
      </div>
    </section>
  );
}
const buttonStyle = {
  display: "flex",
  justifyContent: "center",
  padding: "1rem 3rem",
  borderRadius: "10px",
  backgroundColor: "none",
  color: "#a1a1a1",
  bordr: "none",
  fontSize: "1.5rem",
  transition: "all 0.2s ease", 
  width: "100%",
  cursor: "pointer",
};
const activeButtonStyle = {
  ...buttonStyle,

  color: "#00e676",
};

