import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { showSuccess, showWarning } from "../../utils/toast";

export default function EntryIncome () {
    const [income, setIncome] = useState([]);
    const [newIncome, setNewIncome] = useState({ name:"", amount:"", frequency:"", currency:"", tax:"" });
    const [hasLoaded, setHasLoaded] = useState(false);

    // -- Load Income
    useEffect(() => {
        const savedIncome = localStorage.getItem("income");
        if (savedIncome && savedIncome !== "[]" && savedIncome !== "null") {
            setIncome(JSON.parse(savedIncome));
        }
        else {
            console.log("No saved Incomes found.");
        }
        setHasLoaded(true);
    }, []);

    // -- Save Income
    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem("income", JSON.stringify(income));
        }
    }, [income, hasLoaded]);

    // -- Handle Change 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewIncome((prev) => ({ ...prev, [name]: value}));
    };

    const addIncome = () => {
    if (
        !newIncome.name.trim() ||
        !newIncome.amount ||
        !newIncome.frequency ||
        !newIncome.currency ||
        !newIncome.tax
    ) {
        showWarning("Please fill all fields before adding income.");
        return;
    }

    const updated = [...income, { ...newIncome, amount: Number(newIncome.amount) }];
    setIncome(updated);
    localStorage.setItem("income", JSON.stringify(updated));
    showSuccess(`Income "${newIncome.name}" added successfully!`);

    setNewIncome({ name: "", amount: "", frequency: "", currency: "", tax: "" });
    };


    // -- Remove Income
    const removeIncome = (index) => {
        const removeIncome = income[index];
        const updated = income.filter((_, i) => i !== index);
        setIncome(updated);
        localStorage.setItem("income", JSON.stringify(updated));

        showSuccess(`Income "${removeIncome?.name || "Unknown"}" removed successfully! `);
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
                Income
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
                    value={newIncome.name}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={newIncome.amount}
                    onChange={handleChange}
                    style={inputStyle}
                />

    

                <select 
                    name="frequency"
                    value={newIncome.frequency}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        backgroundColor: "#2b2b2b",
                        borderRadius: "5px",
                        color: "white",
                        textAlign: "center",
                    }}>

                    <option value="no">One-off</option>
                    <option value="daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                    <option value="fortnightly">Fortnightly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="biannually">Bi-Annually</option>
                    <option value="Annually">Annually</option>
                </select>
                
                <select 
                    name="currency"
                    value={newIncome.currency}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        backgroundColor: "#2b2b2b",
                        borderRadius: "5px",
                        color: "white",
                        textAlign: "center",
                    }}>
                    <option value="">Select</option>
                    <option value="£">£</option>
                    <option value="$">$</option>
                    <option value="€">€</option>
                </select>

                <input
                    type="number"
                    name="tax"
                    placeholder="tax (%)"
                    value={newIncome.tax}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <button
                    onClick={addIncome}
                    style={buttonAddStyle}
                    >
                    <AiOutlinePlus />
                </button>
            </div>


            {income.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ color: "#9cff66" }}>
                        <th>Name</th>
                        <th>Amount</th>
                        <th>Frequency</th>
                        <th>Currency</th>
                        <th>Tax</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {income.map((income, i) => (
                        <tr key={i}>
                            <td>{income.name}</td>
                            <td>{income.currency}{Number(income.amount).toFixed(2)}</td>
                            <td>{income.frequency}</td>
                            <td>{income.currency}</td>
                            <td>{income.tax}</td>
                            <td>
                            <button
                                onClick={() => removeIncome(i)}
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
                    No Income added yet.
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
