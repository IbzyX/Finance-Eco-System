import { Link, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "./css/Dashboard.css";
import Widget from "../components/Widgets";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>This is the dashboard page.</p>
      <Widget size="small" title="Stock Summary">
        $10000
      </Widget>
      <Widget size="medium" title="investmetn">
        $10209
      </Widget>
      <Widget size="large" title="other">
        $41234231
      </Widget>
    </div>
  );
}
