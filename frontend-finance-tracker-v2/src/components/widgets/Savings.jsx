import React, { useEffect, useRef, useState } from "react";
import "./Widget.css";

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
        else setSavingsList([]);
    };

    useEffect(() => {
        loadSavings();
        const onStorage = () => loadSavings();
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const safeIndex =
        savingsList.length === 0
            ? 0
            : Math.min(index, savingsList.length - 1);

    const current = savingsList[safeIndex];
    const hasSavings = !!current;

    const amount = hasSavings ? Number(current.initialAmount) : 0;
    const goalAmount = hasSavings ? Number(current.targetAmount) : 0;
    const goalDate = hasSavings ? current.targetDate : null;
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

    const monthsUntilGoal = (() => {
        if (!goalDate) return 0;
        const now = new Date();
        const target = new Date(goalDate);

        const years = target.getFullYear() - now.getFullYear();
        const months = target.getMonth() - now.getMonth();

        return years * 12 + months;
    })();

    const intervalToMonthly = {
        no: 0,
        daily: 30,
        weekly: 4,
        fortnightly: 2,
        monthly: 1,
        quarterly: 1 / 3,
        biannually: 1 / 6,
        annually: 1 / 12,
    };

    const contributionMonthly =
        (Number(current?.contributionAmount) || 0) *
        (intervalToMonthly[current?.contributionInterval] || 0);

    const totalProjected =
        Number(current?.initialAmount) +
        contributionMonthly * monthsUntilGoal;

    const goalAchievable = totalProjected >= goalAmount;

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
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",  
                    }}
                    >
                    £{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}

                    {!goalAchievable && (
                        <div className="tooltip-wrapper">
                            <span className="tooltip-icon">⚠</span>

                            <div className="tooltip-box">
                                This plan will NOT reach the target in time
                            </div>
                        </div>
                    )}
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
