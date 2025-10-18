import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    // --- Navbar Style --- 
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem"}}>
            <img src="./favicon.png" alt="logo" style={{ height: "50px" }}></img>
            <h2 style={{ fontSize: "1.75rem", margin:"0rem" , color: "white"}}>Finance Tracker</h2>
        </div>


        {/* --- Navbar right style --- */}
        <div style={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.25rem",
            gap: "20px",
            marginLeft: "2rem", 
            }}>

            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/settings"><i className="fa-solid fa-gear" style={{color: "white", fontSize: "1.75rem" }}></i></Link>
        </div>
    </nav>
  );
}
