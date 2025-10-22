import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { showSuccess } from "../utils/toast";

export default function Navbar() {

    /* -- User Authentication -- */
    const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();
    const [hasShownLoginToast, setHasShownLoginToast] = useState(false);

    //login alert
    useEffect(() => {
        if(isAuthenticated && !hasShownLoginToast) {
            showSuccess(`Welcome back,${user?.name || "User"}!`)
            setHasShownLoginToast(true);
        }
    }, [isAuthenticated, hasShownLoginToast, user]);








  /* -- Dropdown -- */
  const [isHovered, setIsHovered] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(prev => !prev);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const shouldShowDropdown = isHovered || isDropdownOpen;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoading) return null;

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
        {isAuthenticated ? (
          <>
            <Link to="/" style={navLinkStyle}>Home</Link>
            <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>

            <div style={{ position: "relative" }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                ref={dropdownRef}
                >
                <button
                    onClick={toggleDropdown}
                    style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                    }}
                >
                    
                    <img
                    src={user?.picture}
                    alt="Profile"
                    style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "2px solid white",
                        objectFit: "cover"
                    }}
                    />
                    
                    <span style={{ color: "white", fontSize: "0.75rem" }}>▼</span> 
                </button>

                {shouldShowDropdown && (
                    <div style={dropdownStyle}>
                    <Link to="/settings" style={dropdownLinkStyle}>Settings</Link>
                    <div style={{ borderBottom: "2px solid white", margin: "7px" }}></div>
                    <button onClick={() => logout({ returnTo: window.location.origin })} style={logoutButtonStyle}>
                        Logout
                    </button>
                    </div>
                )}
            </div>

          </>
        ) : (
            <button 
            onClick={() => loginWithRedirect() } 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                background: isHovered ? "#444" : "none",
                padding: "10px 20px",
                fontSize: "1.25rem",
                color: "white",
                border: isHovered ? "1px solid white" : "none" ,
                borderRadius: "15px",
                cursor: "pointer",
                transition: "all 0.3s ease",
            }}>
                Login
            </button>
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
    backgroundColor: "#303030",
    padding: "10px",
    border: "2px solid #b4b4b4ff",
    borderRadius: "10px",
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
