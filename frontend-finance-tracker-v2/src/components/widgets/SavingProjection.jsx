import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function SavingProjection() {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const [savingsList, setSavingsList] = useState([]);
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

    useEffect(() =>{
        const saved = JSON.parse(localStorage.getItem("saving")) || [];
        setSavingsList(Array.isArray(saved) ? saved : []);
    }, []);

    const buildProjection = (entry) => {
        const startAmount = Number(entry.initalAmount) || 0;
        const monthlyContribution = 
            (Number(entry.contributionAmount) || 0) *
            (intervalToMonthly[entry.contributionInterval] || 0);

        const today = new Date();
        const goal = new Date(entry.targetDate);

        const months =
            (goal.getFullYear() - today.getFullYear()) * 12 +
            (goal.getMonth() - today.getMonth());

        const points = [];
        let runningTotal = startAmount;

        for (let i = 0; i <= months; i++) {
            points.push(runningTotal);
            runningTotal += monthlyContribution;
        }
        return points;
    };

    const getMaxMonths = () => {
        return savingsList.reduce((max, entry) => {
            const diff = 
                (new Date(entry.targetDate).getFullYear() - new Date().getFullYear()) *
                    12 +
                (new Date(entry.targetDate).getMonth() - new Date().getMonth());

            return Math.max(max, diff);
        }, 0);
    };

    useEffect(() => {
        if (!canvasRef.current || savingsList.length === 0) return;
        const ctx = canvasRef.current.getContext("2d");
        if  (chartRef.current) chartRef.current.destroy();

        const labels = Array.from({ length: getMaxMonths() + 1 }).map(
            ( _, i ) => `Month ${i}`
        );
        
        
        const lineColors = [
            "#6ce5e8",
            "#48e055",
            "#ff9800",
            "#ff3bb4",
            "#b388ff",
            "#ffd54f",
        ];

        const datasets = savingsList.map((entry, i) => ({
            lable: entry.goal || `Goal ${i + 1}`,
            data: buildProjection(entry),
            fill: false,
            borderColor: lineColors[i % lineColors.length],
            tesion: 0.3,
        }));

        const maxMonths = getMaxMonths();
        const totalLine = Array.from({ length: maxMonths + 1 }).map(
            ( _, idx ) =>
                savingsList.reduce((sum,entry) => {
                    const entryLine = buildProjection(entry);
                    return sum + (entryLine[idx] || entryLine[entryLine.length - 1] || 0);
            }, 0)
        );

        datasets.push({
            label: "TOTAL",
            data: totalLine,
            borderColor: "white",
            borderWidth: 3,
            tension: 0.25,
        });

        chartRef.current = new Chart(ctx, {
            type: "line",
            data: {labels, datasets },
            options: { 
                responsive: true,
                maintainAspectRatio: false,
                plugins: {legned: {labels: {color: "#fff" } } },
                scales: {
                    x: { ticks: {color: "#ccc" } },
                    y: { ticks: {color: "#ccc" } },
                },
            },
        });
    }, [savingsList]);


    return (
        <div style={{ width: "100%", height: "300px" }}>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}