import React, { useEffect, useState } from "react";

export default function UpcomingBillsWidget() {
  const [bills, setBills] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    console.log("Loading bills from localStorage...");
    const savedBills = localStorage.getItem("bills");

    if (!savedBills) {
      console.warn(" No saved bills found in localStorage.");
      setBills([]);
      setTotal(0);
      return;
    }

    try {
      // Parse and sanitize stored data
      const parsedBills = JSON.parse(savedBills).map((b) => ({
        name: b.name || "Unnamed Bill",
        amount: Number(b.amount) || 0,
        date: b.date || "",
        type: b.type || "N/A",
      }));

      const today = new Date();
      const thirtyDays = new Date();
      thirtyDays.setDate(today.getDate() + 30);

      // Only include bills due within 30 days
      const upcomingBills = parsedBills
        .filter((b) => {
          const billDate = new Date(b.date);
          return billDate >= today && billDate <= thirtyDays;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setBills(upcomingBills);
      setTotal(upcomingBills.reduce((sum, b) => sum + Number(b.amount || 0), 0));
    } catch (err) {
      console.error(" Failed to parse bills:", err);
      setBills([]);
      setTotal(0);
    }
  }, []); // Only run on mount

  return (
    <div>
      <h3>Upcoming Bills</h3>
      <p>
        Total bills due in 30 days:{" "}
        <strong>£{Number(total || 0).toFixed(2)}</strong>
      </p>

      {bills.length === 0 ? (
        <p style={{ color: "#aaa" }}>No upcoming bills found.</p>
      ) : (
        <div className="bills-table-container">
          <table>
            <thead>
              <tr>
                <th>Bill</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, i) => (
                <tr key={i}>
                  <td>{bill.name}</td>
                  <td>{bill.date}</td>
                  <td>£{Number(bill.amount).toFixed(2)}</td>
                  <td>{bill.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
