import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { showSuccess, showWarning } from "../../utils/toast";
import "../../pages/css/EntryForm.css";

export default function EntryInvestments() {
    const [Investment, setInvestment] = useState([]);
    const [newInvestment, setNewInvestment] = useState({
        name: "",
        type: "",
        amount: "",
        currency: "",
        contributionInterval: "",
        contributionAmount: "",
        avarageValue: "",
        DoP: "",
    });
    const [hasLoaded, setHasLoaded] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editInvestment, setEditInvestment] = useState({
        name: "",
        type: "",
        amount: "",
        currency: "",
        contributionInterval: "",
        contributionAmount: "",
        avarageValue: "",
        DoP: "",
    });

    useEffect(() => {
        const savedInvestment = localStorage.getItem("investment");
        if (savedInvestment && savedInvestment !== "[]" && savedInvestment !== "null") {
            setInvestment(JSON.parse(savedInvestment));
        }
        setHasLoaded(true);
    }, []);

    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem("investment", JSON.stringify(Investment));
        }
    }, [Investment, hasLoaded]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewInvestment((prev) => ({ ...prev, [name]: value }));
    };

    const addInvestment = () => {
        if (
            !newInvestment.name.trim() ||
            !newInvestment.type ||
            !newInvestment.amount ||
            !newInvestment.currency ||
            !newInvestment.contributionInterval ||
            !newInvestment.contributionAmount ||
            !newInvestment.avarageValue ||
            !newInvestment.DoP
        ) {
            showWarning("Please fill all fields before adding Investments.");
            return;
        }

        const updated = [...Investment, { ...newInvestment }];
        setInvestment(updated);
        localStorage.setItem("investment", JSON.stringify(updated));
        showSuccess(`Investment "${newInvestment.name}" added successfully!`);

        setNewInvestment({ 
            name: "",
            type: "",
            amount: "",
            currency: "",
            contributionInterval: "",
            contributionAmount: "",
            avarageValue: "",
            DoP: "",
        });
    };

    const removeInvestment = (index) => {
        const removedInvestment = Investment[index];
        const updated = Investment.filter((_,i) => i !== index);
        setInvestment(updated);
        localStorage.setItem("investment", JSON.stringify(updated));

        showSuccess(`Investment "${removedInvestment?.name || "Unknown"}" removed succesfully!`);
    };

    const startEditInvestment = (index) => {
        const inv = Investment[index];
        if(!inv) return;

        setEditIndex(index);
        setEditInvestment({ ...inv });
        setIsEditing(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditInvestment((prev) => ({ ...prev, [name]: value }));
    };

    const saveEditInvestment = () => {
        if (
            !editInvestment.amount ||
            !editInvestment.contributionInterval ||
            !editInvestment.contributionAmount ||
            !editInvestment.avarageValue 
        ) {
            showWarning("Please fill all fields before saving changes.");
            return;
        }

        const updated = [...Investment];
        updated[editIndex] = { ...editInvestment };
        setInvestment(updated);
        localStorage.setItem("investment",JSON.stringify(updated));
        showSuccess(`Investment "${editInvestment.name}" updated successfully!`);

        setIsEditing(false);
        setEditIndex(null);
    };

    const cancelEdit = () => {
        setIsEditing(false);
        setEditIndex(null);
    };

    return (
        <div
            style={{
                color: "white",
                borderRadius: "15px",
                width: "100%",
                maxWidth: "1000px",
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
                Investments
            </h2>


            <div
                style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr)) 40px",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
                borderBottom: "2px solid #9cff66",
                paddingBottom: "2rem",
                }}
            >
                <input
                type="text"
                name="name"
                placeholder="Name"
                value={newInvestment.name}
                onChange={handleChange}
                style={inputStyle}
                />

                <select
                    name="type"
                    value={newInvestment.type}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        backgroundColor: "#2b2b2b",
                        borderRadius: "5px",
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    <option value="">Type</option>
                    <option value="stock">Stock</option>
                    <option value="ETF">ETF</option>
                    <option value="real-estate">Real-estate</option>
                </select>

                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={newInvestment.amount}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <select
                    name="currency"
                    value={newInvestment.currency}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        backgroundColor: "#2b2b2b",
                        borderRadius: "5px",
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    <option value="">Currency</option>
                    <option value="£">£</option>
                    <option value="$">$</option>
                    <option value="€">€</option>
                </select>


                <select
                    name="contributionInterval"
                    value={newInvestment.contributionInterval}
                    onChange={handleChange}
                    style={{
                        ...inputStyle,
                        backgroundColor: "#2b2b2b",
                        borderRadius: "5px",
                        color: "white",
                        textAlign: "center",
                    }}
                >
                    <option value="">Contribution Intervals</option>
                    <option value="no">One-off</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="fortnightly">Fortnightly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="biannually">Bi-Annually</option>
                    <option value="annually">Annually</option>
                </select>

                <input
                    type="number"
                    name="contributionAmount"
                    placeholder="Contribution Amount"
                    value={newInvestment.contributionAmount}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="amount"
                    name="avarageValue"
                    placeholder="Avarage Value"
                    value={newInvestment.avarageValue}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <input
                    type="text"
                    name="DoP"
                    placeholder="Date of Purchase"
                    value={newInvestment.DoP}
                    onFocus={(e) => (e.target.type = "date")}
                    onBlur={(e) => {
                        if (!e.target.value) e.target.type = "text";
                    }}
                    onChange={handleChange}
                    style={inputStyle}
                />

                <button
                    onClick={addInvestment}
                    style={buttonAddStyle}
                    >
                    <AiOutlinePlus />
                </button>

            </div>

           {Investment.length > 0 ? (
                <table style={tableStyle}>
                    <thead>
                        <tr style={{ color: "#9cff66" }}>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Contribution<br />Interval</th>
                        <th>Contribution<br />Amount</th>
                        <th>Avarage<br />Value</th>
                        <th>Date Of<br />Purchase</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Investment.map((investment, i) => (
                            <tr key={i}>
                            <td>{investment.name}</td>
                            <td>{investment.type}</td>
                            <td>{investment.amount}</td>
                            <td>{investment.currency}</td>
                            <td>{investment.contributionInterval}</td>
                            <td>{investment.currency}{investment.contributionAmount}</td>
                            <td>{investment.currency}{investment.avarageValue}</td>
                            <td>{investment.DoP}</td>
                            <td>
                                <button
                                    onClick={() => startEditInvestment(i)}
                                    style={{
                                        ...buttonRemoveStyle,
                                        backgroundColor: "#4caf50",
                                        color: "#000",
                                    }}
                                >
                                    <MdEdit size={20} color="#000" />
                                </button>
                            </td>
                            <td>
                                <button
                                onClick={() => removeInvestment(i)}
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
                    No Investments added yet.
                </p>
            )}

            {isEditing && (
                <div 
                    style={{
                        position: "fixed",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "#222",
                            padding: "1.5rem 2rem",
                            borderRadius: "12px",
                            maxWidth: "1000px",
                            width: "100%",
                            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
                        }}
                    >
                        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", fontWeight: "bold", textDecoration: "underline" }}>
                            Edit Investment
                        </h2>


                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
                                gap: "0.5rem",
                                marginBottom: "1rem",
                            }}
                        >
                            <div style={fieldGroup}>
                                <label style={{ color: "#9cff66", marginBottom: "1.25rem", fontWeight: "bold" }}>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={editInvestment.name}
                                    onChange={handleEditChange}
                                    style={inputStyle}
                                />
                            </div>

                            <div style={fieldGroup}>
                                <label style={{ color: "#9cff66", marginBottom: "1.25rem", fontWeight: "bold" }}>Type</label>
                                <select
                                    name="type"
                                    value={editInvestment.type}
                                    onChange={handleEditChange}
                                    style={{
                                        ...inputStyle,
                                        backgroundColor: "#2b2b2b",
                                        borderRadius: "5px",
                                        color: "white",
                                        textAlign: "center",
                                    }}
                                >
                                    <option value="">Type</option>
                                    <option value="stock">Stock</option>
                                    <option value="ETF">ETF</option>
                                    <option value="real-estate">Real-estate</option>
                                </select>
                            </div>
                            
                            <div style={fieldGroup}>
                                <label style={{ color: "#9cff66", marginBottom: "1.25rem", fontWeight: "bold" }}>Amount</label>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    value={editInvestment.amount}
                                    onChange={handleEditChange}
                                    style={inputStyle}
                                />
                            </div>
                            <div style={fieldGroup}>
                                <label style={{ color: "#9cff66", marginBottom: "1.25rem", fontWeight: "bold" }}>Currency</label>
                                <select
                                    name="currency"
                                    value={editInvestment.currency}
                                    onChange={handleEditChange}
                                    style={{
                                        ...inputStyle,
                                        backgroundColor: "#2b2b2b",
                                        borderRadius: "5px",
                                        color: "white",
                                        textAlign: "center",
                                    }}
                                >
                                    <option value="">Currency</option>
                                    <option value="£">£</option>
                                    <option value="$">$</option>
                                    <option value="€">€</option>
                                </select>
                            </div>
                            <div style={fieldGroup}>
                                <label style={{ color: "#9cff66", fontWeight: "bold", textAlign: "center" }}>Contribution<br />Interval</label>
                                <select
                                    name="contributionInterval"
                                    value={editInvestment.contributionInterval}
                                    onChange={handleEditChange}
                                    style={{
                                        ...inputStyle,
                                        backgroundColor: "#2b2b2b",
                                        maxWidth: "100px",
                                        borderRadius: "5px",
                                        color: "white",
                                        textAlign: "center",
                                    }}
                                >
                                    <option value="">Contribution Intervals</option>
                                    <option value="no">One-off</option>
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="fortnightly">Fortnightly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="quarterly">Quarterly</option>
                                    <option value="biannually">Bi-Annually</option>
                                    <option value="annually">Annually</option>
                                </select>
                            </div>

                            <div style={fieldGroup}>
                                <label style={{ color: "#9cff66", fontWeight: "bold", textAlign: "center" }}>Contribution<br />Amount</label>
                                <input
                                    type="number"
                                    name="contributionAmount"
                                    placeholder="Contribution Amount"
                                    value={editInvestment.contributionAmount}
                                    onChange={handleEditChange}
                                    style={inputStyle}
                                />
                            </div>

                            <div style={fieldGroup}>
                                <label style={{ color: "#9cff66", fontWeight: "bold", textAlign: "center" }}>Avarage<br />Value</label>
                                <input
                                    type="number"
                                    name="avarageValue"
                                    placeholder="Avarage Value"
                                    value={editInvestment.avarageValue}
                                    onChange={handleEditChange}
                                    style={inputStyle}
                                />
                            </div>

                            <div style={fieldGroup}>
                                <label style={{ color: "#9cff66", fontWeight: "bold", textAlign: "center" }}>Date of<br />Purchase</label>
                                <input
                                    type="date"
                                    name="DoP"
                                    placeholder="Date of Purchase"
                                    value={editInvestment.DoP}
                                    onChange={handleEditChange}
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: "0.75rem",
                                marginTop: "1rem",
                            }}
                        >
                            <button
                                onClick={cancelEdit}
                                style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#555",
                                border: "none",
                                borderRadius: "6px",
                                color: "white",
                                cursor: "pointer",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEditInvestment}
                                style={{
                                padding: "0.5rem 1rem",
                                backgroundColor: "#9cff66",
                                border: "none",
                                borderRadius: "6px",
                                color: "#000",
                                cursor: "pointer",
                                fontWeight: "bold",
                                }}
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
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
const fieldGroup = {
  display: "flex",
  marginBottom: "1rem",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.4rem",
};

