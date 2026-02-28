import React, { useEffect, useState } from "react";
import { Chart as ChartJS, TimeScale, LinearScale, CategoryScale, Tooltip, Legend, } from "chart.js";
import { CandlestickController, CandlestickElement, } from "chartjs-chart-financial";
import "chartjs-adapter-date-fns";
import FinancialChart from "./FinancialChart";

ChartJS.register( CategoryScale, TimeScale, LinearScale, Tooltip, Legend, CandlestickController, CandlestickElement );

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

    // Load investments
    useEffect(() => {
        try {
        const saved = JSON.parse(localStorage.getItem("investment") || "[]");
        setInvestments(Array.isArray(saved) ? saved : []);
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

        const symbol = (holding?.name || "").trim().toUpperCase();
        if (!symbol) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(
                `http://localhost:5000/api/stocks/${symbol}`
            );

            if (!res.ok) {
                throw new Error("Backend request failed");
            }

            const json = await res.json();
            const result = json?.chart?.result?.[0];

            if (!result) throw new Error("Invalid Yahoo response");

            const timestamps = result.timestamp || [];
            const quote = result.indicators?.quote?.[0] || {};

            const candles = timestamps
                .map((t, i) => ({
                    x: new Date(t * 1000),
                    o: quote.open?.[i],
                    h: quote.high?.[i],
                    l: quote.low?.[i],
                    c: quote.close?.[i],
                }))
                .filter(
                    (c) =>
                        c.o != null &&
                        c.h != null &&
                        c.l != null &&
                        c.c != null
                );

            if (candles.length === 0)
                throw new Error("No valid candle data");

            setChartData({
                datasets: [
                    {
                        label: `${symbol} Price`,
                        data: candles,
                        color: {
                            up: "#48e055",
                            down: "#ff5252",
                            unchanged: "#999",
                        },
                    },
                ],
            });

            const closes = quote.close?.filter((c) => c != null) || [];
            const livePrice =
                result.meta?.regularMarketPrice ||
                closes[closes.length - 1];

            if (!livePrice || isNaN(livePrice))
                throw new Error("Invalid price data from Yahoo");

            const prevClose = closes.length > 1 ? closes[closes.length - 2] : livePrice;

            const quantity = Number(holding?.amount) || 0;
            const averagePrice = Number(holding?.avarageValue) || 0;

            const marketValue = livePrice * quantity;
            const pnl = (livePrice - averagePrice) * quantity;
            const pnlPercent = averagePrice > 0 ? ((livePrice - averagePrice) / averagePrice) * 100 : 0;

            const change = livePrice - prevClose;
            const changePercent = prevClose > 0 ? ((livePrice - prevClose) / prevClose) * 100 : 0;

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
            console.error(err);
            setError(err.message);
            setChartData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentHolding) return;

        fetchStockData(currentHolding);

        const interval = setInterval(() => {
            fetchStockData(currentHolding);
        }, 30000);

        return () => clearInterval(interval);
    }, [currentHolding]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label(context) {
                        const v = context.raw;
                        return `O:${v.o} H:${v.h} L:${v.l} C:${v.c}`;
                    },
                },
            },
        },
        scales: {
            x: {
                type: "time",
                time: { unit: "month" },
                grid: { color: "#333" },
                ticks: { color: "#ccc" },
            },
            y: {
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

    const safeFixed = (v, d = 2) => typeof v === "number" && !isNaN(v) ? v.toFixed(d) : "0.00";

    if (investments.length === 0) {
        return (
            <div style={{ color: "#aaa", textAlign: "center" }}>
                No investments found.
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", color: "white" }}>
            <div style={{ flex: 1, minHeight: 0, background: "#181818", borderRadius: 10, padding: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h3>{metrics.symbol}</h3>
                    <div style={{ textAlign: "right" }}>
                        <div style={{ fontWeight: "bold" }}>
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
                            {formatSigned(metrics.change)} ({formatSigned(metrics.changePercent)}%)
                        </div>
                    </div>
                </div>

                <div style={{ height: 260 }}>
                    {loading && <div>Loading…</div>}
                    {error && <div style={{ color: "red" }}>{error}</div>}
                    {chartData && !error && (
                        <FinancialChart
                            data={chartData}
                            options={chartOptions}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}