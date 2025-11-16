import React, { useEffect, useRef, useState } from "react";

export default function Savings() {
  const [savingsList, setSavingsList] = useState([]);
  const [index, setIndex] = useState(0);
  const circleRef = useRef(null);

  const formatDate = (dateStr) => {
    if (!dateStr || !dateStr.includes("-")) return dateStr;
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  };

  const loadSavings = () => {
    const data = JSON.parse(localStorage.getItem("saving"));
    if (Array.isArray(data)) setSavingsList(data);
    else setSavingsList([]); // Always set something
  };

  useEffect(() => {
    loadSavings();
    const onStorage = () => loadSavings();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Ensure index is valid
  const safeIndex =
    savingsList.length === 0
      ? 0
      : Math.min(index, savingsList.length - 1);

  const current = savingsList[safeIndex];

  // Handle empty case (but DON'T return early)
  const hasSavings = !!current;

  const amount = hasSavings ? Number(current.initialAmount) : 0;
  const goalAmount = hasSavings ? Number(current.targetAmount) : 0;
  const goalDate = hasSavings ? current.targetDate : "goal date";
  const goalName = hasSavings ? current.goal : "Savings";

  const progress =
    goalAmount > 0 ? Math.min((amount / goalAmount) * 100, 100) : 0;

  useEffect(() => {
    if (circleRef.current) {
      const length = circleRef.current.getTotalLength();
      circleRef.current.style.strokeDasharray = length;
      circleRef.current.style.strokeDashoffset =
        length * (1 - progress / 100);
    }
  }, [progress, safeIndex]);

  const nextGoal = () => {
    if (savingsList.length > 0) {
      setIndex((prev) => (prev + 1) % savingsList.length);
    }
  };

  const prevGoal = () => {
    if (savingsList.length > 0) {
      setIndex((prev) =>
        prev === 0 ? savingsList.length - 1 : prev - 1
      );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.75rem",
        color: "white",
        position: "relative",
      }}
    >
      {hasSavings && (
        <button
          onClick={prevGoal}
          style={{
            position: "absolute",
            left: 0,
            top: "40%",
            background: "transparent",
            color: "#6ce5e8",
            border: "none",
            fontSize: "2rem",
            cursor: "pointer",
          }}
        >
          ‹
        </button>
      )}

      {/* Donut */}
      <div
        style={{
          width: "100px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          viewBox="0 0 36 36"
          style={{
            width: "90%",
            height: "90%",
            transform: "rotate(-90deg)",
            overflow: "visible",
          }}
        >
          <path
            style={{
              fill: "none",
              stroke: "#0c9d9dff",
              strokeWidth: "8",
            }}
            d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          />

          <path
            ref={circleRef}
            style={{
              fill: "none",
              stroke: "#6ce5e8",
              strokeWidth: "8",
              strokeLinecap: "round",
              transition: "stroke-dashoffset 0.8s ease",
            }}
            d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
      </div>

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {goalName}
        </h3>

        <div
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
            color: "#48e0e0",
          }}
        >
          £{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>

        <div
          style={{
            fontSize: "1rem",
            color: "grey",
            textAlign: "center",
          }}
        >
          <div>Goal: {formatDate(goalDate)}</div>
          <div>
            Goal Amount: £
            {goalAmount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        {!hasSavings && (
          <div style={{ marginTop: "1rem", color: "#888" }}>
            No savings found.
          </div>
        )}
      </div>

      {hasSavings && (
        <button
          onClick={nextGoal}
          style={{
            position: "absolute",
            right: 0,
            top: "40%",
            background: "transparent",
            color: "#6ce5e8",
            border: "none",
            fontSize: "2rem",
            cursor: "pointer",
          }}
        >
          ›
        </button>
      )}
    </div>
  );
}
