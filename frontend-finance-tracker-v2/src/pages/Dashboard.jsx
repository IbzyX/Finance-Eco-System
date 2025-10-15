import { Link } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>This is the dashboard page.</p>

      <Link to="/">
        <button className="btn">Back to Home</button>
      </Link>
    </div>
  );
}
