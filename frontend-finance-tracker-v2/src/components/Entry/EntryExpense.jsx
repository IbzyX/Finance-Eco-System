import React, { useEffect, useState } from "react";
import { showSuccess, showWarning } from "../../utils/toast";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";


export default function EntryExpense () {
    const [expense, setExpense] = useState([]);
    const [newExpense, setNewExpense] = useState({ name:"", amount:"", date:"", reoccurring:"", totalAmount:""});
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const savedExpense = localStorage.getItem("expense");
        if (savedExpense && savedExpense !== "[]" && savedExpense !== "null") {
            setExpense(JSON.parse(savedExpense));
        }
        else {
            console.log("no saved Expense found.");
        }
        setHasLoaded(true);
    }, []);

    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem("expense", JSON.stringify(expense));
        }
    }, [expense, hasLoaded]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExpense((prev) => ({ ...prev, [name]: value}));
    };

    const addExpense = () => {
        if (
            !newExpense.name.trim() |
            !newExpense.amount ||
            !newExpense.date ||
            !newExpense.reoccurring ||
            !newExpense.totalAmount 
        ) {
            showWarning("Please fill all fields before adding Expense. ");
            return;
        }

        const updated = [ ...expense, { ...newExpense, amount: Number(newExpense.amount)}];
        setExpense(updated);
        localStorage.setItem("expense", JSON.stringify(updated));
        showSuccess(`Expense "${newExpense.name}" addedd successfully! `);

        setNewExpense({  name:"", amount:"", date:"", reoccurring:"",totalAmount:"" });
    };

    const removeExpense = (index) => {
        const removeExpense = expense[index];
        const updated = expense.filter((_,i) => i !== index);
        setExpense(updated);
        localStorage.setItem("expense", JSON.stringify(updated));

        showSuccess(`Expense "${removeExpense?.name || "Unknown" }" removed successfully. `);
    };


    return (
        <div
            style={{
                color: "white",
                borderRadius: "15px",
                padding: "",
                width: "100%",
                maxWidth: "950px",
                margin: "0 auto",
            }}
            >
            <h2
                style={{
                textAlign: "center",
                textDecoration: "underline",
                marginBottom: "1.5rem",
                }}
            >
                Expense
            </h2>

            {/* Input Row */}
            <div
                style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                alignItems: "center",
                
                marginBottom: "1rem",
                borderBottom: "2px solid #9cff66",
                paddingBottom: "2rem",
                }}
            >

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newExpense.name}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={handleChange}
                    style={inputStyle}
                />
                
                <input
                    type="date"
                    name="date"
                    value={newExpense.date}
                    onChange={handleChange}
                    style={inputStyle}
                />
                <input
                    type="number"
                    name="reoccurring"
                    placeholder="reoccurence"
                    value={newExpense.reoccurring}
                    onChange={handleChange}
                    style={inputStyle}
                />
                
                <input
                    type="number"
                    name="totalAmount"
                    placeholder="total Amount"
                    value={newExpense.totalAmount}
                    onChange={handleChange}
                    style={inputStyle}
                />
                
                

                

                <button
                    onClick={addExpense}
                    style={buttonAddStyle}
                    >
                    <AiOutlinePlus />
                </button>
            </div>


            {expense.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ color: "#9cff66" }}>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Reoccurring</th>
                        <th>Total Amount</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {expense.map((expense, i) => (
                        <tr key={i}>
                            <td>{expense.name}</td>
                            <td>{Number(expense.amount).toFixed(2)}</td>
                            <td>{expense.date}</td>
                            <td>{expense.reoccurring}</td>
                            <td>{expense.totalAmount}</td>
                            <td>
                            <button
                                onClick={() => removeExpense(i)}
                                style={buttonRemoveStyle}
                            >
                                <AiOutlineMinus />
                            </button>
                            </td>
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
    );
}   


const inputStyle = {
    background: "transparent",
    border: "none",
    borderBottom: "none",
    color: "white",
    padding: "0.5rem 0 0.5rem 0",
    fontSize: "1rem",
    textAlign: "center",
    outline: "none",
};

const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
    color: "white",
};

const buttonAddStyle = {
    backgroundColor: "#9cff66",
    border: "none",
    borderRadius: "50%",
    color: "#000",
    fontSize: "1.5rem",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
};

const buttonRemoveStyle = {
    backgroundColor: "#9cff66",
    border: "none",
    borderRadius: "50%",
    color: "#000",
    fontSize: "1.2rem",
    width: "30px",
    height: "30px",
    cursor: "pointer",
};
