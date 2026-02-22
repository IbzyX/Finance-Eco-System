import React, { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth0 } from "@auth0/auth0-react";

export default function Habits() {
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch("http://localhost:5000/api/expense", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                const categoryMap = {};

                data.forEach((expense) => {
                    const total = Number(expense.amount) * Number(expense.reoccurring);

                    if (categoryMap[expense.category]) {
                        categoryMap[expense.category] += total;
                    } else {
                        categoryMap[expense.category] = total;
                    }
                });

                const formatted = Object.keys(categoryMap).map((category) => ({
                    category,
                    value: categoryMap[category],
                }));

                setChartData(formatted);

            } catch (err) {
                console.error("Failed to fetch expenses for habits:", err);
            }
        };

        if (isAuthenticated) {
            fetchExpenses();   
        }
    }, [isAuthenticated]);

    return (
    <div style={{ width: "100%", height: "100%" }}>
        {chartData.length === 0 ? (
        <p>No expense data yet.</p>
        ) : (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={chartData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis tick={false} axisLine={false} />

                <Tooltip
                    contentStyle={{
                        backgroundColor: "#111",
                        border: "1px solid #333",
                        borderRadius: "8px"
                    }}
                    formatter={(value) => [`£${value}`, "Amount"]}
                />
                <Radar
                    dataKey="value"
                    stroke="#9cff66"
                    fill="#9cff66"
                    fillOpacity={0.6}
                    activeDot={{ r: 6 }}
                />
            </RadarChart>
        </ResponsiveContainer>
        )}
    </div>
    );
}