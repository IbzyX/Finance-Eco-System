import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./Widget.css";

export default function Widget({
  title,
  size = "medium",
  children,
  onWidgetChange,
  onRemove,
  isEditing = false,
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState(title);
  const [currentChild, setCurrentChild] = useState(children);

  useEffect(() => {
    setCurrentChild(children);
  }, [children]);

  const handleExpand = () => setExpanded(!expanded);

  const handleWidgetChange = (e) => {
    const newValue = e.target.value;
    setSelectedWidget(newValue);
    if (onWidgetChange) onWidgetChange(newValue);
  };

  const widgetContent = (
    <>
      {expanded && <div className="widget-backdrop" onClick={handleExpand}></div>}

      <div
        className={`widget ${size} ${expanded ? "expanded" : ""} ${
          isEditing ? "editing" : ""
        }`}
      >
        <div className="widget-header">
          <h3>{selectedWidget}</h3>

          <div className="widget-controls">
            {isEditing && (
              <button
                className="remove-btn"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={() => onRemove && onRemove(title)}
                title="Remove Widget"
              >
                ✕
              </button>
            )}

            {!isEditing && expanded && (
              <select
                className="widget-dropdown"
                value={selectedWidget}
                onChange={handleWidgetChange}
              >
                <option value="Total wealth">Total wealth</option>
                <option value="Investments">Investments</option>
                <option value="Savings">Savings</option>
                <option value="Accounts">Accounts</option>
                <option value="Upcoming Bills">Upcoming Bills</option>
                <option value="Cashflow Chart">Cashflow Chart</option>
                <option value="CashFlow">CashFlow</option>
                <option value="Habits">Habits</option>
                <option value="Debt">Debt</option>
                <option value="Income">Income</option>
                <option value="Expense">Expense</option>
                <option value="Savings projection">Savings Projection</option>
              </select>
            )}

            {!isEditing && (
              <button className="expand-btn" onClick={handleExpand}>
                {expanded ? "⤢ Collapse" : "⤢ Expand"}
              </button>
            )}
          </div>
        </div>

        {!isEditing ? (
          <div className="widget-content">
            {React.isValidElement(currentChild)
              ? React.cloneElement(currentChild, { isExpanded: expanded })
              : currentChild}
          </div>
        ) : (
          <div className="widget-edit-placeholder">
            <p>Drag or remove this widget</p>
          </div>
        )}
      </div>
    </>
  );

  if (expanded) {
    return ReactDOM.createPortal(widgetContent, document.body);
  }

  return widgetContent;
}
