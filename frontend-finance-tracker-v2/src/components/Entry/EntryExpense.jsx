import React, { useEffect, useState } from "react";
import { showSuccess, showWarning } from "../../utils/toast";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useAuth0 } from "@auth0/auth0-react";

export default function EntryExpense () {
    const [expense, setExpense] = useState([]);
    const [newExpense, setNewExpense] = useState({ name:"", amount:"", date:"", category:"", reoccurring:"" });
    const { getAccessTokenSilently, isAuthenticated} = useAuth0();
    const [useToday, setUseToday] = useState(false);

    useEffect(() => {
        const fetchExpense = async () => {
            try {
                const token = await getAccessTokenSilently();
                const res = await fetch("http://localhost:5000/api/expense", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                setExpense(data);
            } catch (err) {
                console.error("Failed to fetch expense: ", err);
            }
        };
        if (isAuthenticated) {
            fetchExpense();
        }
    }, []);

    const categories = [
        "Food",
        "Transport",
        "Shopping",
        "Entertainment",
        "Health",
        "Other",
    ];
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExpense((prev) => ({ ...prev, [name]: value}));
    };

    const addExpense = async () => {
        if (
            !newExpense.name.trim() ||
            !newExpense.amount ||
            !newExpense.date ||
            !newExpense.category ||
            !newExpense.reoccurring
        ) {
            showWarning("Please fill all fields before adding Expense.");
            return;
        }
        
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch("http://localhost:5000/api/expense",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...newExpense,
                    amount: Number(newExpense.amount),
                    reoccurring: Number(newExpense.reoccurring),
                }),
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.log("SERVER ERROR:", errorText);
                throw new Error("Failed to save expense");
            }

            const savedExpense = await res.json();
            setExpense(prev => [...prev, savedExpense]);
            showSuccess(`Expense "${newExpense.name}" added successfully!`);

            setNewExpense({ name: "", amount: "", date: "", category: "", reoccurring: "", totalAmount:"" });
        } catch (err) {
            console.error("Error adding expense: ", err);
        }
    };


    const removeExpense = async (id) => {
        try {
            const token = await getAccessTokenSilently();
            await fetch(`http://localhost:5000/api/expense/${id}`, {
                method: "DELETE",
                headers: { 
                    Authorization: `Bearer ${token}`,
                }
            });
            setExpense(prev => prev.filter(expense => expense.id !== id));
            showSuccess("Expense removed successfully!");
        } catch (err) {
            console.error("Error deleting expense: ", err);
        }
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
                
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center"}}>
                    <input
                        type="date"
                        name="date"
                        value={
                            useToday ? new Date().toISOString().split("T")[0] : newExpense.date
                        }
                        onChange={handleChange}
                        disabled={useToday}
                        style={{
                            ...inputStyle,
                            opacity: useToday ? 0.4 : 1,
                            borderBottom: useToday ? "1px dashed #666" : "1px solid #9cff66",
                            cursor: useToday ? "not-allowed" : "pointer"
                        }}
                    />
                    <label style={{ fontSize: "1rem", marginTop: "4px" }}>
                        <input
                            type="checkbox"
                            checked={useToday}
                            onChange={(e) => {
                                const checked = e.target.checked;
                                setUseToday(checked);

                                if (checked) {
                                    setNewExpense((prev) => ({
                                        ...prev,
                                        date: new Date().toISOString().split("T")[0]
                                    }));
                                }
                            }}
                        />
                        Today
                    </label>
                </div>

                <select
                    name="category"
                    value={newExpense.category}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        backgroundColor: "#2b2b2b",  
                    }}
                >
                    <option value="">Category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    name="reoccurring"
                    placeholder="reoccurence"
                    value={newExpense.reoccurring}
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
                            <td>
                            <button
                                onClick={() => removeExpense(expense.id)}
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
