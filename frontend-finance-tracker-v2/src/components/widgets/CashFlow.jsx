import React, { useEffect, useState, useRef } from "react";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { useAuth0 } from "@auth0/auth0-react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CashFlow({ isExpanded = false }) {
  const [totals, setTotals] = useState({ income: 0, expense: 0, bills: 0 });
  const [height, setHeight] = useState(250);
  const containerRef = useRef(null);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  useEffect(() => {
    const fetchCashFlow = async () => {
      try {
        const token = await getAccessTokenSilently();

        // -- Fetch income
        const incomeRes = await fetch("http://localhost:5000/api/income", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const incomeData = await incomeRes.json();

        // -- Fetch Bills
        const billsRes = await fetch("http://localhost:5000/api/bills", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const billsData = await billsRes.json();

        // -- Fetch Expense
        //
        //

        const totalIncome = incomeData.reduce(
          (sum, item) => sum + (Number(item.net_monthly) || 0),
          0
        );

        const totalBills = billsData.reduce(
          (sum, item) => sum + (Number(item.amount) || 0),
          0
        );

        setTotals({
          income: totalIncome,
          expense: 0,
          bills: totalBills,
        });
      } catch (err) {
        console.error("Failed to fetch cashFlow: ", err);
      }
    };

    if (isAuthenticated) {
      fetchCashFlow();
    }
  }, [isAuthenticated]);


  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => {
      const newHeight = containerRef.current.offsetHeight;
      setHeight(Math.max(newHeight - 60, 180));
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const expandedHeight = isExpanded ? "60vh" : `${height}px`;
  const expandedFontSize = isExpanded ? "1.2rem" : "1rem";

  const data = {
    labels: [""],
    datasets: [
      {
        label: "Income (After Tax)",
        data: [totals.income],
        backgroundColor: "#00e676",
        borderColor: "#35b075ff",
        borderWidth: 1,
        stack: "income",
      },
      {
        label: "Expenses",
        data: [totals.expense],
        backgroundColor: "#e600adff",
        borderColor: "#e600adff",
        borderWidth: 1,
        stack: "outgoings",
      },
      {
        label: "Bills",
        data: [totals.bills],
        backgroundColor: "#ff8d1cff",
        borderColor: "#c98139ff",
        borderWidth: 1,
        stack: "outgoings",
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
        stacked: true,  
        ticks: {
          callback: (v) => `£${v.toLocaleString()}`,
          color: "#fff",
        },
        grid: { display: false },
      },
      y: {
        stacked: true,  
        ticks: { color: "#fff" },
        grid: { display: false },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
          font: { size: 13, weight: "bold" },
        },
      },
    },
  };


  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: expandedHeight,
        maxHeight: "300px",
        position: "relative",
        transition: "height 0.4s ease",
      }}
    >
    {totals.income === 0 && totals.expense === 0 && totals.bills === 0 ? (
      <p style={{ color: "#aaa" }}>No upcoming bills found.</p>
    ) : (
      <>
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
            <span>Income: £{totals.income.toLocaleString()}</span>
            <span>Expense: £{totals.expense.toLocaleString()}</span>
            <span>Bills: £{totals.bills.toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  );
}
