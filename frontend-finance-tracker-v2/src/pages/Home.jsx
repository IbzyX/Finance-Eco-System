import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { showLogout } from "../utils/toast";
import "./css/Home.css";

export default function Home() {
  const { loginWithRedirect, logout, isAuthenticated, isLoading } = useAuth0();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showLogout("You've been logged out.");
    }
  }, [isAuthenticated, isLoading]);


  return (
    <div className="home">
      {/* - Hidden Navbar - */}
      <div className="navbar">

        {/* --- Navbar left style --- */}
        <div className="navbar-left">
          <img src="./favicon.png" alt="logo" style={{ height: "50px" }} />
          <h1>Finance Tracker</h1>
        </div>

        {/* --- Navbar right style --- */}
        <div className="navbar-right">
          {isAuthenticated ? (
            <Link to="/dashboard"
              className="nav-btn">
              Dashboard
            </Link>
            
          ) : (

            <button
              onClick={() =>
                loginWithRedirect({
                  appState: {
                      returnTo: "/dashboard", 
                  },
                })
              }
              className="nav-btn">
              Login
            </button>
          )}
        </div>
      </div>


      {/* --- CTA section --- */}
      <div className="CTA">
        <p className="CTA-heading">
          Track expenses, categorize spending and <br /> understand your financial habits
        </p>
        <p className="CTA-subtext">
          Understand where your money goes with automated <br /> breakdowns, <br /> Visualize income v expense to make smarter decisions
        </p>
        <div className="home-image">
        {/*<img src=""></img>*/}
        </div>

        {isAuthenticated ?(
          <Link to="/dashboard"
              className="signup">
              LOGIN 
            </Link>
        ):(
          <button 
            onClick={() =>
              loginWithRedirect({
                appState: {
                    returnTo: "/dashboard", 
                },
              })
            }
            className="signup">
            Sign UP NOW 
          </button>
        )}
        
      </div>

      


      {/* --- ECO-SYSTEM links --- */}
      <div className="link-grid">
        <Link to="/dashboard" className="link-btn">
          <h2 style={{fontSize: "1.5rem", marginTop: "2rem"}}>Finance Tracker</h2>

          <div className="link-img">

          </div>
          <p className="link-text">
            Understand where your money <br /> ends up ... 
          </p>
        </Link>

        <Link to="http://localhost:5173/" target="blank" className="link-btn">
          <h2 style={{fontSize: "1.5rem", marginTop: "2rem"}}>Stock News Feed</h2>

          <div className="link-img">

          </div>
          <p className="link-text">
            Keep up with the news that <br/> matters ... 
          </p>
        </Link>

      </div>
    </div>
  );
}
