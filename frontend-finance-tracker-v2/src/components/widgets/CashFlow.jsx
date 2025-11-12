import React, { useEffect, useState, useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CashFlow({ isExpanded = false }) {
  const [totals, setTotals] = useState({ income: 0, expense: 0, bills: 0 });
  const [height, setHeight] = useState(250);
  const containerRef = useRef(null);

  // === Utility helpers ===
  const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];
  const calculateTotal = (key, amountKey = "amount") =>
    getData(key).reduce((sum, item) => sum + (parseFloat(item[amountKey]) || 0), 0);

  const updateTotals = () => {
    setTotals({
      income: calculateTotal("income"),
      expense: calculateTotal("expense"),
      bills: calculateTotal("bills"),
    });
  };

  // === Watch for localStorage changes ===
  useEffect(() => {
    updateTotals();
    const handleStorageChange = () => updateTotals();
    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(updateTotals, 3000);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // === Responsive height logic ===
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      const newHeight = containerRef.current.offsetHeight;
      setHeight(Math.max(newHeight - 60, 180));
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // === Expanded size scaling ===
  const expandedHeight = isExpanded ? "60vh" : `${height}px`;
  const expandedFontSize = isExpanded ? "1.2rem" : "1rem";
  const expandedLegendPos = isExpanded ? "top" : "bottom";

  const data = {
    labels: [""],
    datasets: [
      {
        label: "Income",
        data: [totals.income],
        backgroundColor: "#6ce5e8",
        borderColor: "#48e0e0",
        borderWidth: 1,
      },
      {
        label: "Expenses",
        data: [totals.expense],
        backgroundColor: "#ff3bb4",
        borderColor: "#e233a2",
        borderWidth: 1,
      },
      {
        label: "Bills",
        data: [totals.bills],
        backgroundColor: "#ff9800",
        borderColor: "#f57c00",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    indexAxis: "y",
    animation: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (v) => `£${v.toLocaleString()}`,
          color: "#fff",
        },
        grid: { display: false },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#fff" },
      },
    },
    plugins: {
      legend: {
        position: expandedLegendPos,
        labels: { color: "#fff", font: { size: isExpanded ? 16 : 14 } },
        position: "bottom",
      },
    },
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: expandedHeight,
        minHeight: "250px",
        position: "relative",
        transition: "height 0.4s ease",
      }}
    >
      <Bar data={data} options={{ ...options, maintainAspectRatio: false }} />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          gap: "2rem",
          marginBottom: "0.5rem",
          fontSize: expandedFontSize,
        }}
      >
        <span>Expense: £{totals.expense.toLocaleString()}</span>
        <span>Bills: £{totals.bills.toLocaleString()}</span>
        <span>Income: £{totals.income.toLocaleString()}</span>
      </div>
    </div>
  );
}
