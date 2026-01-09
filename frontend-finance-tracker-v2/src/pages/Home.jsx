import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { showLogout } from "../utils/toast";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [hoveredItem, setHoveredItem] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showLogout("You've been logged out.");
    }
  }, [isAuthenticated, isLoading]);


  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }}>


      <div style={{ minHeight: "90vh"}}>
        <h1>Home Page</h1>
      </div>
    
      <div style={{ borderBottom: "2px solid white", width: "80%", margin: "20px" }}></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", alignItems: "center", justifyContent: "center" }}>
        <Link to="/dashboard" style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: hoveredItem === "finance-tracker" ? "#666" : "#333",
          borderRadius: "10px",
          padding: "0 0 3rem 0",
          width: "80%", 
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          minWidth: "15vw",
          margin: "3rem",
        }}
        onMouseEnter={() => setHoveredItem("finance-tracker")}
        onMouseLeave={() => setHoveredItem(false)}
        >
          <h2 style={{fontSize: "1rem"}}>Finance Tracker</h2>

        </Link>

        <Link to="http://localhost:5173/" target="blank" style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: hoveredItem === "news-feed" ? "#666" : "#333",
          borderRadius: "10px",
          padding: "0 0 3rem 0",
          width: "80%", 
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          minWidth: "15vw",
          margin: "3rem",
        }}
        onMouseEnter={() => setHoveredItem("news-feed")}
        onMouseLeave={() => setHoveredItem(false)}
        >
          <h2 style={{fontSize: "1rem"}}>Stock News Feed</h2>

        </Link>

      </div>

    </div>

  );
}
