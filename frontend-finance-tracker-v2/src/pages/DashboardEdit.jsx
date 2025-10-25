import React, { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";
import { defaultLayout } from "../utils/defaultLayout";

import Widget from "../components/widgets/Widgets";
import UpcomingBill from "../components/widgets/UpcomingBills";

import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import "./css/Dashboard.css"



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


    if (isLoading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/" />;


    const handleSaveLayout = () => {
        localStorage.setItem("dashboardLayout", JSON.stringify(layout));
        alert("Layout saved!");
    };

    const handleResetLayout = () => {
        setLayout(defaultLayout);
        localStorage.removeItem("dashboardLayout");
    };

    const widgets = [
        { title: "Total Pie", size: "large", component: <p>Total Pie chart placeholder</p> },
        { title: "Upcoming Bills", size: "medium", component: <UpcomingBill /> },
        { title: "Accounts", size: "medium", component: <p>Accounts placeholder</p> },
        { title: "Savings", size: "small", component: <p>Savings placeholder</p> },
        { title: "Cashflow Chart", size: "medium", component: <p>Cashflow placeholder</p> },
        { title: "Investments", size: "large", component: <p>Investments placeholder</p> },
        { title: "Savings Projection", size: "large", component: <p>Savings chart placeholder</p> },
        { title: "Habits", size: "medium", component: <p>Habits placeholder</p> },
    ];

    
    return (
        <div className="dashboard-edit">
            
            <div className="edit-section">
                <GridLayout
                    className="dashboard"
                    layout={layout}
                    cols={3}
                    rowHeight={50}
                    width={1200}
                    margin={[15, 15]}
                    onLayoutChange={(newLayout) => setLayout(newLayout)}
                    isResizable={true}
                    isDraggable={true}
                    >
                    {widgets.map(widget => (
                        <div key={widget.title}>
                        <Widget title={widget.title} size={widget.size}>
                            {widget.component}
                        </Widget>
                        </div>
                    ))}
                </GridLayout>
            </div>

            <div className="edit-controls">
                <button onClick={handleSaveLayout}>Save Layout</button>
                <button onClick={handleResetLayout}>Reset to Default</button>
            </div>
            
        </div>
    )
    
}