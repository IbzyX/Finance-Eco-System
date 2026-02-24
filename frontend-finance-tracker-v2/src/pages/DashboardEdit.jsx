import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GridLayout from "react-grid-layout";
import { useAuth0 } from "@auth0/auth0-react";
import { defaultLayout } from "../utils/defaultLayout";

import Widget from "../components/widgets/Widgets";
import UpcomingBill from "../components/widgets/UpcomingBills";
import Savings from "../components/widgets/Savings";
import CashFlow from "../components/widgets/CashFlow";
import SavingProjection from "../components/widgets/SavingProjection";
import TotalWealth from "../components/widgets/TotalWealth";
import Income from "../components/widgets/income";
import Investments from "../components/widgets/Investment";
import Habits from "../components/widgets/Habits";
import Expense from "../components/widgets/Expense";


import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./css/Dashboard.css";

export default function DashboardEdit() {
    const {getAccessTokenSilently, isAuthenticated, isLoading } = useAuth0();
    const [layout, setLayout] = useState(defaultLayout);
    const [gridWidth, setGridWidth] = useState(window.innerWidth - 60); // 20px padding each side
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLayout = async () => {
            const token = await getAccessTokenSilently();

            const res = await fetch("http://localhost:5000/api/dashboard_layout", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (data?.layout) {
                setLayout(data.layout);
            }
        };
        fetchLayout();
    }, []);

    useEffect(() => {
        const handleResize = () => setGridWidth(window.innerWidth - 60);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    // Define all widgets
    const allWidgets = [
        { id: "Total Wealth", size: "large", component: <TotalWealth /> },
        { id: "Accounts", size: "medium", component: <p>Accounts placeholder</p> },
        { id: "Cashflow Chart", size: "medium", component: <p>Cashflow placeholder</p> },
        { id: "CashFlow", size: "medium", component: <CashFlow /> },



        { id: "Investments", size: "large", component: <Investments /> },
        { id: "Savings Projection", size: "large", component: <SavingProjection /> },
        { id: "Savings", size: "small", component: <Savings /> },
        { id: "Income", size: "medium", component: <Income /> },



        { id: "Upcoming Bills", size: "medium", component: <UpcomingBill /> },
        { id: "Habits", size: "medium", component: <Habits /> },
        { id: "Debt", size: "medium", component: <p>Debt placeholder</p> },
        { id: "Expense", size: "medium", component: <Expense /> },


    ];

    // Track active widgets separately
    const [activeWidgets, setActiveWidgets] = useState(allWidgets.map(w => w.id));

    const handleSaveLayout = async () => {
        const token = await getAccessTokenSilently();

        await fetch("http://localhost:5000/api/dashboard_layout", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ layout }),
        });

        navigate("/dashboard");
    };



    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/" />;

    return (
        <div className="dashboard-edit-container">


            {/* === GRID CONTAINER === */}
            <div className="grid-container">
                <GridLayout
                    className="dashboard-edit-grid"
                    layout={layout}
                    cols={3}
                    rowHeight={52}
                    width={1200}
                    margin={[15, 15]}
                    onLayoutChange={(newLayout) => setLayout(newLayout)}
                    isResizable={true}
                    isDraggable={true}
                    isBounded={true}
                    compactType="vertical"
                    preventCollision={false}
                >
                {allWidgets
                    .filter(widget => activeWidgets.includes(widget.id))
                    .map(widget => (
                    <div key={widget.id}>
                        <Widget
                            title={widget.id}
                            size={widget.size}
                            isEditing={true}
                            onRemove={(id) =>
                                setActiveWidgets(prev => prev.filter(w => w !== id))
                            }
                        />
                </div>
                ))}
            </GridLayout>
        </div>



        {/* === SIDEBAR === */}
        <div className="widget-list-container">
            <h3><em>Edit Widgets</em></h3>

            <div className="widget-section">
                <h4>Other</h4>
                {["Total Wealth", "Accounts", "Cashflow Chart", "CashFlow"].map((w) => (
                    <p
                        key={w}
                        className={activeWidgets.includes(w) ? "active-widget" : "inactive-widget"}
                        onClick={() => {
                            if (!activeWidgets.includes(w)) {
                                setActiveWidgets(prev => [...prev, w]);
                            }
                        }}
                        style={{
                            cursor: activeWidgets.includes(w) ? "default" : "pointer",
                            opacity: activeWidgets.includes(w) ? 0.5 : 1,
                        }}
                        >
                        {w}
                    </p>

                ))}
            </div>

            <div className="divider"></div>

            <div className="widget-section">
                <h4>Income</h4>
                {["Investments", "Savings Projection", "Savings", "Income"].map((w) => (
                    <p
                        key={w}
                        className={activeWidgets.includes(w) ? "active-widget" : "inactive-widget"}
                        onClick={() => {
                            if (!activeWidgets.includes(w)) {
                                setActiveWidgets(prev => [...prev, w]);
                            }
                        }}
                        style={{
                            cursor: activeWidgets.includes(w) ? "default" : "pointer",
                            opacity: activeWidgets.includes(w) ? 0.5 : 1,
                        }}
                        >
                        {w}
                    </p>

                ))}
            </div>

            <div className="divider"></div>

            <div className="widget-section">
                <h4>Expense</h4>
                {["Upcoming Bills", "Habits", "Debt", "Expense"].map((w) => (
                    <p
                        key={w}
                        className={activeWidgets.includes(w) ? "active-widget" : "inactive-widget"}
                        onClick={() => {
                            if (!activeWidgets.includes(w)) {
                                setActiveWidgets(prev => [...prev, w]);
                            }
                        }}
                        style={{
                            cursor: activeWidgets.includes(w) ? "default" : "pointer",
                            opacity: activeWidgets.includes(w) ? 0.5 : 1,
                        }}
                        >
                        {w}
                    </p>
                ))}
            </div>

            <Link to="/dashboard" className="submit-btn" onClick={handleSaveLayout}>Submit</Link>
           
        </div>
    </div>
  );
}
