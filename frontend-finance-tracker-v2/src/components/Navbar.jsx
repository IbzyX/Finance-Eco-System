import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {

  // Simulated login state
    const [isLoggedIn, setIsLoggedIn] = useState(true); // set to false to test logged-out state
    const [dropdownOpen, setDropdownOpen] = useState(true); // controls settings dropdown


    const toggleDropdown = () => setDropdownOpen(prev => !prev);
    const handleLogout = () => {
        setIsLoggedIn(false);
        setDropdownOpen(false);
    };

  return (
    <nav style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 20px",
        height: "70px",
        gap: "1rem",
        background: "#303030",
        borderBottom: "4px solid #ccc",
        }}>

        {/* --- Navbar left style --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <img src="./favicon.png" alt="logo" style={{ height: "50px" }} />
            <h2 style={{ fontSize: "1.75rem", margin: "0rem", color: "white" }}>Finance Tracker</h2>
        </div>

        {/* --- Navbar right style --- */}
        <div style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.25rem",
            gap: "20px",
            marginLeft: "2rem",
            position: "relative" 
        }}>
        {isLoggedIn ? (
          <>
            <Link to="/" style={navLinkStyle}>Home</Link>
            <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>

            {/* Settings Dropdown */}
            <div style={{ position: "relative" }}>
                <button
                    onClick={toggleDropdown}
                    style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        padding: 0,
                    }}>

                    <i className="fa-solid fa-gear" style={{ color: "white", fontSize: "1.75rem" }}></i>
                </button>

              {dropdownOpen && (
                    <div style={dropdownStyle}>
                        <Link to="/settings" style={dropdownLinkStyle}>Settings</Link>
                        <div style={{ borderBottom: "2px solid white",margin: "7px" }}></div>
                        <button onClick={handleLogout} style={logoutButtonStyle}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
          </>
        ) : (
            <Link to="/login" style={navLinkStyle}>Login</Link>
        )}
      </div>
    </nav>
  );
}

//  Styles
const navLinkStyle = {
    color: "white",
    textDecoration: "none",
};

const dropdownStyle = {
    position: "absolute",
    right: 0,
    top: "100%",
    backgroundColor: "#444",
    padding: "10px",
    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    zIndex: 10,
    minWidth: "150px",
};

const dropdownLinkStyle = {
    display: "block",
    color: "white",
    textDecoration: "none",
    padding: "8px 0",
};

const logoutButtonStyle = {
    fontSize: "1.15rem",
    background: "none",
    border: "none",
    color: "white",
    padding: "8px 0",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
};
