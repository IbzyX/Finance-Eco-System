import React, { useEffect, useState } from "react";

export default function UpcomingBillsWidget() {
  const [bills, setBills] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {

    const storedBills = JSON.parse(localStorage.getItem("bills")) || [
      { name: "Electricity", date: "2025-10-28", amount: 75 },
      { name: "Internet", date: "2025-11-01", amount: 40 },
      { name: "Water", date: "2025-10-30", amount: 30 },
    ];

    const today = new Date();
    const thirtyDays = new Date();
    thirtyDays.setDate(today.getDate() + 30);

    const upcomingBills = storedBills
      .map((bill) => {
        let billDate = new Date(bill.date);
        while (billDate < today) billDate.setMonth(billDate.getMonth() + 1);
        return { ...bill, date: billDate.toISOString().split("T")[0] };
      })
      .filter((bill) => {
        const billDate = new Date(bill.date);
        return billDate >= today && billDate <= thirtyDays;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setBills(upcomingBills);
    setTotal(upcomingBills.reduce((sum, b) => sum + b.amount, 0));
  }, []);

  return (
    <div>
      <p>Total bills due in 30 days: £{total.toFixed(2)}</p>
      <div className="bills-table-container">
        <table>
          <thead>
            <tr>
              <th>Bill</th>
              <th>Due Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {bills.map((bill, i) => (
              <tr key={i}>
                <td>{bill.name}</td>
                <td>{bill.date}</td>
                <td>£{bill.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
