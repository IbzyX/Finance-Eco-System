import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Expense() {
    const [expense, setExpense] = useState([]);
      const [total, setTotal] = useState(0);
    
    const { getAccessTokenSilently, isAuthenticated } = useAuth0();

    useEffect(() => {
        const fetchExpense = async () => {
          try {
            const token = await getAccessTokenSilently();
    
            const res = await fetch("http://localhost:5000/api/expense", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            if (!res.ok) {
              throw new Error("Failed to fetch expense");
            }
    
            const data = await res.json();
    
            if (!data || data.length === 0) {
              setExpense([]);
              setTotal(0);
              return;
            }
    
            const parsedExpense = data.map((e) => ({
              id: e.id,
              name: e.name || "Unnamed Expense",
              amount: Number(e.amount) || 0,
              date: e.date || "",
              category: e.category || "N/A",
              reoccurring: e.reoccurring || "",
            }));
    
            const today = new Date();
            const thirtyDays = new Date();
            thirtyDays.setDate(today.getDate() + 30);
    
            const TotalExpense = parsedExpense
              .map((expense) => {
                let expenseDate = new Date(expense.date);
    
                if (expense.reoccurring) {
                  while (expenseDate < today) {
                    expenseDate.setMonth(expenseDate.getMonth() + 1);
                  }
                }
    
                return { ...expense, date: expenseDate.toISOString().split("T")[0] };
              })
              .filter((expense) => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= today && expenseDate <= thirtyDays;
              })
              .sort((a, e) => new Date(a.date) - new Date(e.date));
    
            setExpense(TotalExpense);
    
            const totalAmount = TotalExpense.reduce(
              (sum, e) => sum + Number(e.amount || 0),
              0
            );
    
            setTotal(totalAmount);
          } catch (err) {
            console.error("Failed to fetch expense: ", err);
            setExpense([]);
            setTotal(0);
          }
        };
    
        if (isAuthenticated) {
          fetchExpense();
        }
    }, [isAuthenticated, getAccessTokenSilently]);

    return (
        <div>
            <p>
                Total Expense due in 30 days:{" "}
                <strong style={{color:"#00e676"}}>£{Number(total || 0).toFixed(2)}</strong>
            </p>

            {expense.length > 0 ? (
                <table className="bills-table-container">
                    <thead>
                        <tr style={{ color: "#9cff66" }}>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Category</th>
                        <th>Reoccurring</th>
                        <th>Total Amount</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {expense.map((expense, i) => (
                        <tr key={expense.id}>
                            <td>{expense.name}</td>
                            <td>{Number(expense.amount).toFixed(2)}</td>
                            <td>{expense.date}</td>
                            <td>{expense.category}</td>
                            <td>{expense.reoccurring}</td>
                            <td>£{(expense.amount * expense.reoccurring).toFixed(2)}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p style={{ textAlign: "center", color: "#888" }}>
                    No Expense added yet.
                </p>
            )}
        </div>
    )

}