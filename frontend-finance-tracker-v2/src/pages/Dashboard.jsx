import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import GridLayout from "react-grid-layout";

import { defaultLayout } from "../utils/defaultLayout";
import Widget from "../components/widgets/Widgets";
import UpcomingBill from "../components/widgets/UpcomingBills";
import Savings from "../components/widgets/Savings";
import CashFlow from "../components/widgets/CashFlow";
import TotalWealth from "../components/widgets/TotalWealth";
import SavingProjection from "../components/widgets/SavingProjection";
import Income from "../components/widgets/income";
import Investments from "../components/widgets/Investment";
import Debt from "../components/widgets/Debt";

import "./css/Dashboard.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

export default function Dashboard() {
  const { isAuthenticated, isLoading } = useAuth0();
  const [gridWidth, setGridWidth] = useState(window.innerWidth - 60);
  const [widgetTypes, setWidgetTypes] = useState({});



  useEffect(() => {
    const handleResize = () => setGridWidth(window.innerWidth - 60);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" />;

  const savedLayout = JSON.parse(localStorage.getItem("dashboardLayout"));
  const layout = savedLayout || defaultLayout;

  const handleWidgetChange = (id, newType) => {
    setWidgetTypes((prev) => ({ ...prev, [id]: newType }));
  };


  
  const renderWidget = (id, size) => {
    const type = widgetTypes[id] || id; 

    switch (type) {
      case "Upcoming Bills":
        return (
          <Widget
            title="Upcoming Bills"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)} 
          >
            <UpcomingBill />
          </Widget>
        );
      case "Total Wealth":
        return (
          <Widget
            title="Total Wealth"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <TotalWealth />
          </Widget>
        );
      case "Accounts":
        return (
          <Widget
            title="Accounts"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <p>Cards and accounts placeholder</p>
          </Widget>
        );
      case "Savings":
        return (
          <Widget
            title="Savings"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <Savings />
          </Widget>
        );
      case "Cashflow Chart":
        return (
          <Widget
            title="Cashflow Chart"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <p>CashFlow chart placeholder</p>
          </Widget>
        );
      case "CashFlow":
        return (
          <Widget
            title="CashFlow"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <CashFlow />
          </Widget>
        );
      case "Investments":
        return (
          <Widget
            title="Investments"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <Investments />
          </Widget>
        );
      case "Savings Projection":
        return (
          <Widget
            title="Savings Projection"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <SavingProjection />
          </Widget>
        );
      case "Habits":
        return (
          <Widget
            title="Habits"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <p>Habits placeholder</p>
          </Widget>
        );
      case "Debt":
        return (
          <Widget
            title="Debt"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <Debt />
          </Widget>
        );
      case "Income":
        return (
          <Widget
            title="Income"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <Income />
          </Widget>
        );

      case "Expense":
        return (
          <Widget
            title="Expense"
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <p>Expense placeholder</p>
          </Widget>
        );
      default:
        return (
          <Widget
            title={id}
            size={size}
            onWidgetChange={(newType) => handleWidgetChange(id, newType)}
          >
            <p>Widget not found</p>
          </Widget>
        );
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
