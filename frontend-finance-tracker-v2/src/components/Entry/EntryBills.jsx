import React, { useState, useEffect } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { showSuccess, showWarning } from "../../utils/toast";

export default function EntryBills() {
    const [bills, setBills] = useState([]);
    const [newBill, setNewBill] = useState({ name: "", amount: "", date: "", recurring:"no", type: "" });
    const [hasLoaded, setHasLoaded] = useState(false);

    // -- Load bills 
    useEffect(() => {
        const fetchBills = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/bills");
                const data = await res.json();
                setBills(data);
            } catch (err) {
                console.error("Error fetching bills: ", err);
            }
        };
        fetchBills();
    }, []);


    // -- Handle changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBill((prev) => ({ ...prev, [name]: value }));
    };

    // -- Add a new bill
    const addBill = async () => {
        if (
            !newBill.name.trim() ||
            !newBill.amount ||
            !newBill.date ||
            !newBill.type.trim()
        ) {
            showWarning("Please fill all fields before adding a bill.");
            return;
        }
        try {
            const res = await fetch("http://localhost:5000/api/bills", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...newBill,
                    amount: Number(newBill.amount),
                    recurring: newBill.recurring === "yes",
                }),
            });

            const savedBill = await res.json();
            setBills(prev => [...prev, savedBill]);

            showSuccess(`Bill "${newBill.name}" added successfully!`);

            setNewBill({
                name: "",
                amount: "",
                date: "", 
                type: "",
                recurring: "no",
            });
        } catch (err) {
            console.error("Error adding bill: ", err);
        
        }
    };

    // -- Remove bill
    const removeBill = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/bills/${id}`, {
                method: "DELETE",
            });
            setBills(prev => prev.filter(bill => bill.id !== id));
            showSuccess("Bill removed successfully!");
        } catch (err) {
            console.error("Error deleting bill: ", err);
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
                Bills
            </h2>

            {/* Input Row */}
            <div
                style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1rem",
                borderBottom: "2px solid #9cff66",
                paddingBottom: "2rem",
                }}
            >

                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={newBill.name}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={newBill.amount}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="date"
                    name="date"
                    value={newBill.date}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="text"
                    name="type"
                    placeholder="Type"
                    value={newBill.type}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        backgroundColor: "#2b2b2b",
                        borderRadius: "5px",
                        color: "white",
                        textAlign: "center",
                    }}  
                />
                <select 
                    name="recurring"
                    value={newBill.recurring}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        backgroundColor: "#2b2b2b",
                        borderRadius: "5px",
                        color: "white",
                        textAlign: "center",
                    }}                    >
                        <option value="no">One-off</option>
                        <option value="yes">Recurring</option>
                    </select>
                <button
                    onClick={addBill}
                    style={buttonAddStyle}
                    >
                    <AiOutlinePlus />
                </button>
            </div>

            {/* List */}
            {bills.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ color: "#9cff66" }}>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Due Date</th>
                        <th>Type</th>
                        <th>Recurring</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill, i) => (
                        <tr key={bill.id}>
                            <td>{bill.name}</td>
                            <td>£{Number(bill.amount).toFixed(2)}</td>
                            <td>{bill.date}</td>
                            <td>{bill.type}</td>
                            <td>{bill.recurring ? "Yes" : "No"}</td>
                            <td>
                            <button
                                onClick={() => removeBill(bill.id)}
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
                    No bills added yet.
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
