import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import GridLayout from "react-grid-layout";

import { defaultLayout } from "../utils/defaultLayout";
import Widget from "../components/widgets/Widgets";
import UpcomingBill from "../components/widgets/UpcomingBills";
import "./css/Dashboard.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";


export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth0();

  
  const [gridWidth, setGridWidth] = useState(window.innerWidth - 60); 

  useEffect(() => {
  const handleResize = () => setGridWidth(window.innerWidth - 60);
  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
  }, []);
  

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" />;

  const savedLayout = JSON.parse(localStorage.getItem("dashboardLayout"));
  const layout = savedLayout || defaultLayout;

  const renderWidget = (id, size) => {
    switch (id) {
      case "Upcoming Bills":
      return (
        <Widget title="Upcoming Bills" size={size}>
          <UpcomingBill />
        </Widget>
      );
      case "Total Pie":
      return (
        <Widget title="Total Pie" size={size}>
          <p>Total Pie chart placeholder</p>
        </Widget>
      );
      case "Accounts":
      return (
        <Widget title="Accounts" size={size}>
          <p>cards and accounts placeholder</p>
        </Widget>
      );
      case "Savings":
      return (
        <Widget title="Savings" size={size}>
          <p>savings placeholder</p>
        </Widget>
      );
      case "Cashflow Chart":
      return (
        <Widget title="Cashflow Chart" size={size}>
          <p>CashFlow chart placeholder</p>
        </Widget>
      );
      case "Investments":
      return (
        <Widget title="Investments" size={size}>
          <p>Investments chart placeholder</p>
        </Widget>
      );
      case "Savings Projection":
      return (
        <Widget title="Savings Projection" size={size}>
          <p>Savings chart placeholder</p>
        </Widget>
      );
      case "Habits":
      return (
        <Widget title="Habits" size={size}>
          <p>Habits placeholder</p>
        </Widget>
      );
      default: 
      return null;
    }
  };

  return (
    <div className="dashboard">
      <GridLayout
        className="layout"
        layout={layout}
        cols={3}
        rowHeight={52}
        width={gridWidth}
        margin={[15, 15]}
        isDraggable={false}
        isResizable={false}
      >
        {layout.map((item) => (
          <div key={item.i}>{renderWidget(item.i, item.size)}</div>
        ))}
      </GridLayout>
    </div>
  );
}
