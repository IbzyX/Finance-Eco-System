import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useAuth0 } from "@auth0/auth0-react";

export default function TotalWealth() {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        const fetchTotalWealth = async () => {
            try {
                const token = await getAccessTokenSilently();

                // -- Fetch income
                const incomeRes = await fetch("http://localhost:5000/api/income", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const incomeData = await incomeRes.json();
                
                // -- Fetch savings



                // -- Fetch investments


                const totalIncome = incomeData.reduce(
                    (sum, item) => sum + (Number(item.net_monthly) || 0),
                    0
                );

                setTotals({
                    income: totalIncome,
                    savings: 0,
                    investments: 0,
                });
            } catch (err) {
                console.error("Failed to fetch total wealth: ", err);
            }
        };

        if(isAuthenticated) {
            fetchTotalWealth();
        }
    }, [isAuthenticated]);
    

    const [totals, setTotals] = useState({
        income: 0,
        savings: 0,
        investments: 0,
    });


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
