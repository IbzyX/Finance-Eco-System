import React, { useEffect, useState } from "react";
import { Chart as ChartJS, TimeScale, LinearScale, Tooltip, Legend } from "chart.js";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";
import { Chart } from "react-chartjs-2";
import FinancialChart from "./FinancialChart";

ChartJS.register(
    TimeScale,
    LinearScale,
    Tooltip,
    Legend,
    CandlestickController,
    CandlestickElement
);

export default function Investments() {
    const [investments, setInvestments] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [metrics, setMetrics] = useState({
        symbol: "",
        currentPrice: 0,
        change: 0,
        changePercent: 0,
        quantity: 0,
        averagePrice: 0,
        marketValue: 0,
        pnl: 0,
        pnlPercent: 0,
    });

    useEffect(() => {
        const saved = localStorage.getItem("investment");
        if (!saved || saved === "null" || saved === "[]") {
            setInvestments([]);
            return;
        }

        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) setInvestments(parsed);
            else setInvestments([]);
        } catch {
            setInvestments([]);
        }
    }, []);

    const currentHolding =
        investments.length > 0
            ? investments[Math.min(selectedIndex, investments.length - 1)]
            : null;

    const fetchStockData = async (holding) => {
        if (!holding) return;

        const symbol = (currentHolding?.name || "").trim().toUpperCase();
        if (!symbol) return;

        setLoading(true);
        setError(null);

        try {
            const yahooURL = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1y`;
            const res = await fetch(
                `http://localhost:5000/api/stocks/${symbol}`

            );
            if (!res.ok) {
                throw new Error("Failed to fetch bills");
            }

            const json = await res.json();            
            const result = json?.chart?.result?.[0];
            if (!result) throw new Error("Invalid data");

            const ts = result.timestamp || [];
            const quote = result.indicators?.quote?.[0] || {};

            const candles = ts.map((t, i) => ({
                x: new Date(t * 1000),
                o: quote.open?.[i],
                h: quote.high?.[i],
                l: quote.low?.[i],
                c: quote.close?.[i],
            }));

            setChartData({
                datasets: [
                    {
                    label: `${symbol} Price`,
                    data: candles,
                    color: {
                        up: "#48e055",
                        down: "#ff5252",
                        unchanged: "#aaa",
                    },
                    },
                ],
            });

            const closes = quote.close || [];
            
            const livePrice =
                result.meta?.regularMarketPrice || closes[closes.length - 1];
            const prevClose = closes[closes.length - 2] || livePrice;

            const quantity = Number(currentHolding?.amount) || 0;
            const averagePrice = Number(currentHolding?.avarageValue) || 0;

            const marketValue = livePrice * quantity;
            const pnl = (livePrice - averagePrice) * quantity;
            const pnlPercent =
                averagePrice > 0
                    ? ((livePrice - averagePrice) / averagePrice) * 100
                    : 0;

            const change = livePrice - prevClose;
            const changePercent =
                prevClose > 0
                    ? ((livePrice - prevClose) / prevClose) * 100
                    : 0;

             if (!livePrice || isNaN(livePrice)) {
                setError("Invalid price data from Yahoo");
                setLoading(false);
                return;
            }

            setMetrics({
                symbol,
                currentPrice: livePrice,
                change,
                changePercent,
                quantity,
                averagePrice,
                marketValue,
                pnl,
                pnlPercent,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentHolding) return;
        fetchStockData(currentHolding);

        const id = setInterval(() => {
            fetchStockData(currentHolding);
        }, 30000);

        return () => clearInterval(id);
    }, [currentHolding?.name, currentHolding?.amount, currentHolding?.averageValue]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label(context) {
                        const v = context.raw;
                        return `O:${v.o}  H:${v.h}  L:${v.l}  C:${v.c}`;
                    },
                },
            },
        },
        scales: {
            x: {
                type: "time",
                time: { unit: "day" },
                grid: { color: "#333" },
                ticks: { color: "#ccc" },
            },
            y: {
                type: "linear",
                grid: { color: "#333" },
                ticks: { color: "#ccc" },
            },
        },
    };

    const formatSigned = (v) => {
        const num = Number(v) || 0;
        const sign = num > 0 ? "+" : num < 0 ? "-" : "";
        return `${sign}${Math.abs(num).toFixed(2)}`;
    };

    if (investments.length === 0) {
        return (
            <div style={{ color: "#aaa", textAlign: "center", padding: "1rem" }}>
                No investments found.
            </div>
        );
    }
    const safeFixed = (v, digits = 2) => typeof v === "number" && !isNaN(v) ? v.toFixed(digits) : "0.00";

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                color: "white",
                height: "100%",
            }}
        >
            <div style={{ display: "flex", flex: 1, minHeight: 0, gap: "1rem" }}>
                <div
                    style={{
                        flex: 2,
                        background: "#181818",
                        borderRadius: "10px",
                        padding: "0.75rem",
                        minHeight: 0,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "baseline",
                            marginBottom: "0.5rem",
                        }}
                    >
                        <h3>{metrics.symbol}</h3>
                        <div style={{ textAlign: "right", fontSize: "1rem" }}>
                            <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                                £{safeFixed(metrics.currentPrice)}
                            </div>
                            <div
                                style={{
                                    color:
                                        metrics.change > 0
                                            ? "#48e055"
                                            : metrics.change < 0
                                            ? "#ff5252"
                                            : "#ccc",
                                }}
                            >
                                {formatSigned(metrics.change)} (
                                {formatSigned(metrics.changePercent)}%)
                            </div>
                        </div>
                    </div>

                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            minHeight: "180px",
                            maxHeight: "300px",
                        }}
                    >
                        {chartData && (
                            <FinancialChart data={chartData} options={chartOptions} />
                        )}
                        {loading && <div>Loading…</div>}
                        {error && <div style={{ color: "red" }}>{error}</div>}
                    </div>
                </div>

                <div
                    style={{
                        flex: 1,
                        backgroundColor: "#181818",
                        borderRadius: "10px",
                        padding: "0.75rem 1rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <h4 style={{ marginTop: 0, marginBottom: "0.5rem" }}>
                            Position details
                        </h4>
                        <div style={{ fontSize: "1rem", lineHeight: 1.5 }}>
                            <div>
                                Quantity: <strong>{metrics.quantity}</strong>
                            </div>
                            <div>
                                Avg. Price: <strong>££{safeFixed(metrics.averagePrice)}</strong>
                            </div>
                            <div>
                                Market value:{" "}
                                <strong>£{safeFixed(metrics.marketValue)}</strong>
                            </div>
                            <div
                                style={{
                                    marginTop: "0.5rem",
                                    color:
                                        metrics.pnl > 0
                                            ? "#48e055"
                                            : metrics.pnl < 0
                                            ? "#ff5252"
                                            : "#ccc",
                                    fontWeight: "bold",
                                }}
                            >
                                P/L: £{formatSigned(metrics.pnl)} (
                                {formatSigned(metrics.pnlPercent)}%)
                            </div>
                        </div>
                    </div>

                    {currentHolding && (
                        <div style={{ fontSize: "0.75rem", color: "#aaa" }}>
                            <div>Type: {currentHolding.type || "-"}</div>
                            <div>Buy date: {currentHolding.DoP || "-"}</div>
                        </div>
                    )}
                </div>
            </div>

            <div
                style={{
                    marginTop: "0.75rem",
                    background: "#181818",
                    borderRadius: "10px",
                    padding: "0.5rem 0.75rem",
                    maxHeight: "120px",
                    overflowY: "auto",
                }}
            >
                <div style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>
                    Portfolio Position
                </div>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "0.75rem",
                    }}
                >
                    <thead>
                        <tr style={{ color: "#9cff66" }}>
                            <th style={thStyle}>Symbol</th>
                            <th style={thStyle}>Qty</th>
                            <th style={thStyle}>Avg</th>
                            <th style={thStyle}>Last Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {investments.map((inv, i) => {
                            const isActive = i === selectedIndex;
                            return (
                                <tr
                                    key={i}
                                    onClick={() => setSelectedIndex(i)}
                                    style={{
                                        cursor: "pointer",
                                        background: isActive ? "#262626" : "transparent",
                                    }}
                                >
                                    <td style={tdStyle}>
                                        {(inv.name || "").toUpperCase()}
                                    </td>
                                    <td style={tdStyle}>{inv.amount}</td>
                                    <td style={tdStyle}>
                                        £{Number(inv.avarageValue || 0).toFixed(2)}
                                    </td>
                                    <td style={tdStyle}>
                                        {isActive
                                            ? `£${metrics.currentPrice.toFixed(2)}`
                                            : "-"}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = {
    textAlign: "left",
    padding: "0.25rem 0.5rem",
    borderBottom: "1px solid #333",
};

const tdStyle = {
    padding: "0.25rem 0.5rem",
    borderBottom: "1px solid #222",
};
