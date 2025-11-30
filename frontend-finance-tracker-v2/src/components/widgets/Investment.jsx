import React, { useEffect, useState } from "react";
import { Chart as ChartJS, TimeScale, LinearScale, tooltip, Legend, scales } from "chart.js";
import "chartjs-adapter-date-fns";
import { CandlestickController, CandlestickElement } from "chartjs-chart-financial";
import { Chart } from "react-chartjs-2";

ChartJS.register(
    TimeScale,
    LinearScale,
    tooltip, 
    Legend,
    CandlestickController,
    CandlestickElement,
);

export default function Investments() {
    const [investments, setInvestments ] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    
    const [chartData, setChartData] = useState(mull);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [metrics, setMetrics] = useState({
        symbol: "",
        currentPrice: 0,
        change: 0,
        changePercent: 0,
        quantity: 0, 
        avaragePrice: 0,
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
            if (Array.isArray(parse)) {
                setInvestments(parsed);
            } else {
                setInvestments([]);
            }
        } catch (e) {
            console.error("Failded to parse investments from localStorage: ", e);
            setInvestments([]);
        }
    }, []);

    const currentHolding = investments.length > 0 ? investments[Math.min(selectedIndex, investments.length - 1)] : null;

    const fetchStockData = async (holding) => {
        if (!holding) return;

        const symbol = (holding.name || "").trim().toUpperCase();
        if (!symbol) return;

        setLoading(true);
        setError(null);

        try {
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=6mo`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error(`Yahoo API returned ${res.status}`);
            }

            const json = await res.json();
            const result = json?.chart?.result?.[0];
            if (!result) throw new Error("Unexpected yahoo response shape");
            
            const timestamps = result.timestamp || [];
            const quote = result.indicators?.quote?.[0] || {};
            const opens = quote.open || [];
            const highs = quote.high || [];
            const lows = quote.low || [];
            const closes = quote.close || [];

            const candles = timestamps.map((t,i) => ({
                x: new Date(t * 1000),
                o: opens[i],
                h: highs[i],
                l: lows[i],
                c: closes[i],
            }));

            setChartData({
                datasets: [
                    {
                        label: `${symbol} price`,
                        data: candles, 
                        borderColor: "#6ce5e8",
                        color: {
                            up: "#48e055",
                            down: "#ff5252",
                            unchanged: "#cccccc",
                        },
                    },
                ],
            });

            const meta = result.meta || {};
            const livePrice = meta.regularMarketPrice || closes[closes.length - 1];
            const prevClose = closes[closes.length - 2] || livePrice;

            const quantity = Number(holding.amount) || 0;
            const avaragePrice = Number(holding.avarageValue) || 0;

            const marketValue = livePrice * quantity; 
            const pnl = (livePrice - avaragePrice) * quantity;
            const pnlPercent = avaragePrice > 0 ? ((livePrice - avaragePrice) / avaragePrice) * 100 : 0;

            const change = livePrice - prevClose;  
            const changePercent = prevClose > 0 ? ((livePrice - prevClose) / prevClose) * 100 : 0;

            setMetrics({
                symbol,
                currentPrice: livePrice,
                change,
                changePercent,
                quantity,
                avaragePrice,
                marketValue,
                pnl,
                pnlPercent,
            });
        } catch (err) {
            setError(err.message || "failed to load price data");
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
    }, [currentHolding?.name, currentHolding?.amount, currentHolding?.avarageValue]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        parsing: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label(context) {
                        const v = context.raw;
                        if (!v) return "";
                        return `O: ${v.o.toFixed(2)} H: ${v.h.toFixed(
                            2
                        )} L: ${v.l.toFixed(2)} C: ${v.c.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                type: "time",
                time: { unit: "day" },
                ticks: { color: "#ccc" },
                grid: { color: "#333" },
            },
            y: {
                ticks: { color: "#ccc" },
                grid: { color: "#333" },
            },
        },
    };

    const formatSigned = (value, opts = {}) => {
        const num = Number(value) || 0;
        const sign = num > 0 ? "+" : num < 0 ? "-" : "";
        const abs = Math.abs(num).toFixed(opts.dp ?? 2);
        return `${sign}${abs}`;
    };

    if (investments.length === 0) {
        return (
            <div style={{ color: "#aaa", textAlign: "center", padding: "1rem" }}>
                No investments found. 
            </div>
        );
    }

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
                        <h3 style={{ margin: 0 }}>{metrics.symbol || "Investment"}</h3>
                        <div style={{ textAlign: "right", fontSize: "1rem" }}>
                            <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                                £{metrics.currentPrice.toFixed(2)}
                            </div>
                            <div style={{ color: metrics.change > 0 ? "#48e055" : metrics.change < 0 ? "#ff5252" : "#ccc" }}>
                                {formatSigned(metrics.change)} (
                                    {formatSigned(metrics.changePercent, { dp: 2 })}
                                    %
                                )
                            </div>
                        </div>
                    </div>

                    
                </div>
            </div>
        </div>
    )
}