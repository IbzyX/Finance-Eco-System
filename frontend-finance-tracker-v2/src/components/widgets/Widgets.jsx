import React, { useState } from "react";
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

  const handleExpand = () => setExpanded(!expanded);

  const handleWidgetChange = (e) => {
    setSelectedWidget(e.target.value);
    if (onWidgetChange) onWidgetChange(e.target.value);
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
                <option value="Upcoming Bills">Upcoming Bills</option>
                <option value="Cashflow Chart">Cashflow Chart</option>
                <option value="Habits">Habits</option>
                <option value="Debt">Debt</option>
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
          <div className="widget-content">{children}</div>
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
