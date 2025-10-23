import React from "react";
import "./css/Widget.css"

export default function Widget({ size = "Large", title, children }) {
    return (
        <div className={`widget ${size}`}>
            <h3 className="widget-title">{title}</h3>
            <div className="widget-content">{children}</div>
        </div>
    )
}




