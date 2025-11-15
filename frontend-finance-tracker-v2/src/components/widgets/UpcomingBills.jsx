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
      const parsedBills = JSON.parse(savedBills).map((b) => ({
        name: b.name || "Unnamed Bill",
        amount: Number(b.amount) || 0,
        date: b.date || "",
        type: b.type || "N/A",
        recurring: !!b.recurring,
      }));

      const today = new Date();
      const thirtyDays = new Date();
      thirtyDays.setDate(today.getDate() + 30);

      const upcomingBills = parsedBills
        .map((bill) => {
          let billDate = new Date(bill.date);

          if (bill.recurring) {
            while (billDate < today) {
              billDate.setMonth(billDate.getMonth() + 1);
            }
          }

          return { ...bill, date: billDate.toISOString().split("T")[0] };
        })
        .filter((bill) => {
          const billDate = new Date(bill.date);
          return billDate >= today && billDate <= thirtyDays;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setBills(upcomingBills);

      const totalAmount = upcomingBills.reduce(
        (sum, b) => sum + Number(b.amount || 0),
        0
      );
      setTotal(totalAmount);
    } catch (err) {
      console.error("Failed to parse bills:", err);
      setBills([]);
      setTotal(0);
    }
  }, []); 

  return (
    <div>
      <p>
        Total bills due in 30 days:{" "}
        <strong style={{color:"#00e676"}}>£{Number(total || 0).toFixed(2)}</strong>
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
                <th>Recurring</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, i) => (
                <tr key={i}>
                  <td>{bill.name}</td>
                  <td>{bill.date}</td>
                  <td style={{color:"#00e676", fontWeight:"bold"}}>£{Number(bill.amount).toFixed(2)}</td>
                  <td>{bill.type}</td>
                  <td>{bill.recurring ? "Yes" : "No"}</td> 
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
