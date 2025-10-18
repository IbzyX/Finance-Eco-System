import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: "1rem",
        padding: "1rem",
        background: "#f5f5f5",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/settings">Settings</Link>
    </nav>
  );
}
