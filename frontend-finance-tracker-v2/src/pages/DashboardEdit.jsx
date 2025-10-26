import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import GridLayout from "react-grid-layout";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { defaultLayout } from "../utils/defaultLayout";

import Widget from "../components/widgets/Widgets";
import UpcomingBill from "../components/widgets/UpcomingBills";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./css/Dashboard.css";

export default function DashboardEdit() {
    const { isAuthenticated, isLoading } = useAuth0();

    const [layout, setLayout] = useState(() => {
        return JSON.parse(localStorage.getItem("dashboardLayout")) || defaultLayout;
    });

    const [gridWidth, setGridWidth] = useState(window.innerWidth - 60); // 20px padding each side

    useEffect(() => {
        const handleResize = () => setGridWidth(window.innerWidth - 60);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);



    // Define all widgets
    const allWidgets = [
        { id: "Total Pie", size: "large", component: <p>Total Pie chart placeholder</p> },
        { id: "Upcoming Bills", size: "medium", component: <UpcomingBill /> },
        { id: "Accounts", size: "medium", component: <p>Accounts placeholder</p> },
        { id: "Savings", size: "small", component: <p>Savings placeholder</p> },
        { id: "Cashflow Chart", size: "medium", component: <p>Cashflow placeholder</p> },
        { id: "Investments", size: "large", component: <p>Investments placeholder</p> },
        { id: "Savings Projection", size: "large", component: <p>Savings chart placeholder</p> },
        { id: "Habits", size: "medium", component: <p>Habits placeholder</p> },
    ];

    // Track active widgets separately
    const [activeWidgets, setActiveWidgets] = useState(allWidgets.map(w => w.id));

    const handleSaveLayout = () => {
        localStorage.setItem("dashboardLayout", JSON.stringify(layout));
        sessionStorage.setItem("layoutSaved", "true");
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
            <h3><em>Widgets</em></h3>

            <div className="widget-section">
            <h4>Small</h4>
            <p className={activeWidgets.includes("Savings") ? "active-widget" : ""}>Savings</p>
            <p>Income</p>
            <p>Expense</p>
            </div>

            <div className="divider"></div>

            <div className="widget-section">
                <h4>Medium</h4>
                {["Upcoming Bills", "Cashflow Chart", "Habits", "Debt", "Accounts"].map((w) => (
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
                <h4>Large</h4>
                {["Total Pie", "Investments", "Savings Projection"].map((w) => (
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
