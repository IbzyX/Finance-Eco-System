import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function TotalWealth() {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const [totals, setTotals] = useState({
        income: 0,
        savings: 0,
        investments: 0,
    });

    const loadTotals = () => {
        const income =
        JSON.parse(localStorage.getItem("income"))?.reduce(
            (sum, entry) => sum + (parseFloat(entry.amount) || 0),
            0
        ) || 0;

        const savingEntries = JSON.parse(localStorage.getItem("saving")) || [];
        const totalSavings = savingEntries.reduce(
        (sum, s) => sum + (parseFloat(s.initialAmount) || 0),
        0
        );

        const investments =
        JSON.parse(localStorage.getItem("investments"))?.reduce(
            (sum, entry) => sum + (parseFloat(entry.stockAmount) || 0),
            0
        ) || 0;

        setTotals({
        income,
        savings: totalSavings,
        investments,
        });
    };

    useEffect(() => {
        loadTotals();
        const handleStorage = () => loadTotals();
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ro = new ResizeObserver(() => {
            if (chartRef.current) chartRef.current.resize();
        });

        ro.observe(canvasRef.current.parentElement);

        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        if (!canvasRef.current) return;

        const ctx = canvasRef.current.getContext("2d");
        if (chartRef.current) chartRef.current.destroy();

        const centerTextPlugin = {
            id: "centerText",
            beforeDraw(chart) {
                const { ctx, width, height } = chart;
                ctx.save();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "#fff";
                ctx.font = `${height / 12}px sans-serif`;

                const total = Object.values(totals).reduce((a, b) => a + b, 0);
                ctx.fillText(`£${total.toFixed(2)}`, width / 2, height / 2);
                ctx.restore();
            },
        };

        chartRef.current = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: ["Income", "Savings", "Investments"],
                datasets: [
                {
                    data: [totals.income, totals.savings, totals.investments],
                    backgroundColor: ["#6ce5e8", "#48e055", "#ff9800"],
                    hoverOffset: 8,
                },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: "65%",
                plugins: { legend: { display: false } },
            },
            plugins: [centerTextPlugin],
        });
    }, [totals]);

    return (
        <div style={{ width: "100%", height: "100%", display: "flex" }}>
            <div
                style={{
                flex: 1.2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "200px",
                }}
            >
                <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    maxWidth: "100%",
                    maxHeight: "100%",
                }}
                />
            </div>

            <div
                style={{
                flex: 0.8,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                color: "white",
                gap: "1rem",
                paddingLeft: "1rem",
                }}
            >
                <div>
                    <span style={dot("#6ce5e8")}></span>
                    Income: £{totals.income.toFixed(2)}
                </div>
                <div>
                    <span style={dot("#48e055")}></span>
                    Savings: £{totals.savings.toFixed(2)}
                </div>
                <div>
                    <span style={dot("#ff9800")}></span>
                    Investments: £{totals.investments.toFixed(2)}
                </div>
            </div>
        </div>
    );
}

const dot = (color) => ({
  display: "inline-block",
  width: "12px",
  height: "12px",
  borderRadius: "50%",
  backgroundColor: color,
  marginRight: "8px",
});
