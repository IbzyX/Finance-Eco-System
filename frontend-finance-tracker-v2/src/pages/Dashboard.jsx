import { Link, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import "./css/Dashboard.css";
import Widget from "../components/widgets/Widgets";
import UpcomingBill from "../components/widgets/UpcomingBills";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" />;

  return (
    <div 
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: "calc(100vh-110px)",
      backgroundColor: "#000",
      padding: "2rem",
      gap: "2rem",
    }}>



      <Widget title="Upcoming Bills" size="medium">
        <UpcomingBill />
      </Widget>

      <Widget title="Cashflow Chart" size="large">
        <p>CashFlow chart placeholder</p>
      </Widget>



    </div>
  );
}
