import React, { useState } from "react";
import "./Widget.css"

export default function Widget({ title, size = "medium", children, onWidgetChange }) {
    const [expanded, setExpanded] = useState(false);
    const [selectedWidget, setSelectedWidget] = useState(title);

    const handleExpand = () => setExpanded(!expanded);

    const handleWidgetChange = (e) => {
        setSelectedWidget(e.target.value);
        if (onWidgetChange) onWidgetChange(e.target.value);
    };

    return (
        <div className={`widget ${size} ${expanded ? "expanded" : ""}`}>
            <div className="widget-header">
                <h3>{selectedWidget}</h3>

                <div className="widget-controls">
                    <select
                        className="widget-dropdown"
                        value={selectedWidget}
                        onChange={handleWidgetChange}
                    >
                        <option value="Upcoming Bills">Upcoming Bills</option>
                        <option value="Cashflow Chart">Cashflow Chart</option>
                        <option value="Habits">Habits</option>
                        <option value="Debt">Debt</option>
                    </select>

                    <button className="expand-btn" onClick={handleExpand}>
                        {expanded ?  "⤢ Collapse" : "⤢ Expand"}
                    </button>
                </div>
            </div>

            <div className="widget-content">{children}</div>
        </div>
    );
}




