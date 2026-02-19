import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useAuth0 } from "@auth0/auth0-react";


export default function SavingsProjection() {
    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const [savingsList, setSavingsList] = useState([]);
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();


    useEffect(() => {
        const fetchSavings = async () => {
            try {
                const token = await getAccessTokenSilently();

                const res = await fetch("http://localhost:5000/api/savings", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch savings");

                const data = await res.json();
                setSavingsList(data || []);
            } catch (err) {
                console.error("Error fetching savings:", err);
            }
        };

        if (isAuthenticated) {
            fetchSavings();
        }
    }, [isAuthenticated]);

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

    const getMonths = (dateStr) => {
        if (!dateStr) return 0;
        const now = new Date();
        const target = new Date(dateStr);
        return (target.getFullYear() - now.getFullYear()) * 12 +
            (target.getMonth() - now.getMonth());
    };

    const maxMonths = Math.max(
        ...savingsList.map((s) => getMonths(s.targetDate)),
        6
    );

    const labels = Array.from({ length: maxMonths + 1 }, (_, i) => `Month ${i}`);

    const datasets = [];
    const totalRunning = Array(maxMonths + 1).fill(0);

    savingsList.forEach((s, i) => {
        const initial = Number(s.initialAmount) || 0;
        const contrib = Number(s.contributionAmount) || 0;
        const monthly = contrib * (intervalToMonthly[s.contributionInterval] || 0);
        const monthsToGoal = getMonths(s.targetDate);

        const aer = Number(s.aer) || 0;
        const aerMonthlyFactor = 1 + aer / 100 / 12;

        const points = [];
        let runningBalance = initial;

        for (let m = 0; m <= maxMonths; m++) {
            if (m > monthsToGoal) {
                points.push(null);
                continue;
            }

            runningBalance = runningBalance * aerMonthlyFactor + monthly;

            points.push(runningBalance);
            totalRunning[m] += runningBalance;
        }

        datasets.push({
            label: s.goal || `Goal ${i + 1}`,
            data: points,
            borderColor: ["#6ce5e8", "#48e055", "#ff9800", "#e066ff"][i % 4],
            backgroundColor: "transparent",
            borderWidth: 3,
            tension: 0.3,
        });
    });

    datasets.push({
        label: "TOTAL",
        data: totalRunning,
        borderColor: "#fff",
        borderWidth: 3,
        tension: 0.3,
        backgroundColor: "transparent",
    });


    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");

        if (chartRef.current) chartRef.current.destroy();

        chartRef.current = new Chart(ctx, {
            type: "line",
            data: { labels, datasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: "white" } },
                },
                scales: {
                    x: {
                        ticks: { color: "white" },
                        grid: { color: "rgba(255,255,255,0.1)" },
                    },
                    y: {
                        ticks: {
                            color: "white",
                            callback: (v) => "£" + v.toLocaleString(),
                        },
                        grid: { color: "rgba(255,255,255,0.1)" },
                    },
                },
            },
        });
    }, [savingsList]);

    if (savingsList.length === 0) {
        return (
            <div style={{ textAlign: "center", color: "#888", padding: "2rem" }}>
                No savings projection available.
            </div>
        );
    }

    return (
        <div style={{
            width: "100%",
            height: "100%",
            padding: "1rem",
            color: "white",
            boxSizing: "border-box"
        }}>
            <div style={{ width: "100%", height: "100%" }}>
                <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
            </div>
        </div>
    );
}
