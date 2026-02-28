import React, { useEffect, useRef } from "react";
import { Chart as ChartJS } from "chart.js";

export default function FinancialChart({ data, options }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Destroy old chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new ChartJS(canvasRef.current, {
      type: "candlestick",
      data,
      options,
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data, options]);

  return <canvas ref={canvasRef} />;
}