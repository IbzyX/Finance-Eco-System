import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
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
    const [hoveredItem, setHoveredItem] = useState(null);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setDropdownOpen(prev => !prev);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    //const shouldShowDropdown = isHovered || isDropdownOpen;

    const handleDropdownAction = (callback) => {
        if (callback) callback();
        setDropdownOpen(false);
    };

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
    const isDashboard = location.pathname === "/dashboard";





    return (
    <>
        {/* --- Blur dropdown effect --- */}
        {isDropdownOpen && (
            <div style={overlayStyle} onClick={() => setDropdownOpen(false)}></div>
        )}
        
        
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 20px",
            maxHeight: "70px",
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
                {/* -- Home link -- */}
                <NavLink
                    to="/" style={({ isActive }) => ({
                        ...navLinkStyle,
                        color: isActive ? "#00e676" : "white", // green when active
                        borderBottom: isActive ? "2px solid #00e676" : "none",
                    })}
                    >
                    Home
                </NavLink>

                {/* -- Dashboard link -- */}
                <NavLink
                    to="/dashboard" style={({ isActive }) => ({
                        ...navLinkStyle,
                        color: isActive ? "#00e676" : "white",
                        borderBottom: isActive ? "2px solid #00e676" : "none",
                    })}
                    >
                    Dashboard
                </NavLink>

                
                {/* -- Dropdown Btn -- */}
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
                            gap: "5px",
                        }}
                        >
                        {user?.picture ? (
                            <img
                            src={user.picture}
                            alt="Profile"
                            style={userImageStyle}
                            />
                        ) : (
                            <div
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                backgroundColor: "#555",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontSize: "0.8rem",
                            }}
                            >
                            ?
                            </div>
                        )}
                        <span style={{ color: "white", fontSize: "0.75rem" }}>▼</span>
                    </button>


                    {/* -- Dropdown content -- */}
                    {isDropdownOpen /*shouldShowDropdown*/ && (
                        <div style={dropdownStyle}>
                            <div style={userInfo}>
                                <img
                                    src={user?.picture}
                                    alt="Profile"
                                    style={userImageStyle}
                                />
                                <p style={userNameStyle}>{user?.name || "User"}</p>
                            </div>
                            <div style={{ borderBottom: "2px solid #444", margin: "7px" }}></div>


                            {isDashboard && (
                                <div>
                                    <Link to="" 
                                        style={{
                                            display: "block",
                                            color: hoveredItem === "editDashboard" ? "#00e676" : "white",
                                            textDecoration: "none",
                                            padding: "8px 0",
                                        }} 
                                        onClick={() => handleDropdownAction()} 
                                        onMouseEnter={() => setHoveredItem("editDashboard")}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        >
                                        Edit Dashboard
                                    </Link>
                                    
                                    <div style={{ borderBottom: "2px solid #444", margin: "7px" }}></div>
                                </div>
                            )}


                            <Link to="/settings" 
                                style={{
                                    display: "block",
                                    color: hoveredItem === "settings" ? "#00e676" : "white",
                                    textDecoration: "none",
                                    padding: "8px 0",
                                }} 
                                onClick={() => handleDropdownAction()}
                                onMouseEnter={() => setHoveredItem("settings")}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                Settings
                            </Link>

                            <button 
                                style={{
                                    display: "block",
                                    fontSize: "1.5rem",
                                    padding: "8px 0",
                                    color: hoveredItem === "theme" ? "#00e676" : "white",
                                    backgroundColor:"#303030",
                                    border: "none",
                                }} 
                                onClick={() => handleDropdownAction()}
                                onMouseEnter={() => setHoveredItem("theme")}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                Theme
                            </button>
                            <div style={{ borderBottom: "2px solid #444", margin: "7px" }}></div>


                            <button 
                                onClick={() => logout({ returnTo: window.location.origin })} 
                                style={{
                                    fontSize: "1.5rem",
                                    background: "none",
                                    border: "none",
                                    color: hoveredItem === "logout" ? "red" : "white",
                                    padding: "8px 0",
                                    width: "100%",
                                    textAlign: "left",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={() => setHoveredItem("logout")}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                Logout
                            </button>

                        </div>
                    )}
                </div>

            </>
            ) : (
                <button
                    onClick={() =>
                        loginWithRedirect({
                        appState: {
                            returnTo: "/dashboard", 
                        },
                        })
                    }
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        background: isHovered ? "#444" : "none",
                        padding: "10px 20px",
                        fontSize: "1.25rem",
                        color: "white",
                        border: isHovered ? "1px solid white" : "none",
                        borderRadius: "15px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                    }}
                    >
                    Login
                </button>

            )}
        </div>
        </nav>
    </>
    );
}

//  Styles
const navLinkStyle = {
    color: "white",
    textDecoration: "none",
};

const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backdropFilter: "blur(4px)",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 10,
};

// -- Dropdown 
const dropdownStyle = {
    position: "absolute",
    right: 0,
    top: "100%",
    width: "350px",
    backgroundColor: "#303030",
    padding: "30px",
    fontSize: "1.5rem",
    border: "2px solid #b4b4b4ff",
    borderRadius: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    zIndex: 10,
    minWidth: "150px",
};

const userInfo = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    paddingBottom: "10px",
};
const userImageStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid white",
};

const userNameStyle = {
    color: "white",
    fontSize:"1.1rem",
    margin: "0",
    fontWeight: "500",
};
