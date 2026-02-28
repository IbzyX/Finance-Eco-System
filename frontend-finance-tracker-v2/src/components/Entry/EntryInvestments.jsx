import React, { useEffect, useState } from "react";
import { AiOutlinePlus, AiOutlineMinus, AiOutlineEdit } from "react-icons/ai";
import { showSuccess, showWarning } from "../../utils/toast";
import "../../pages/css/EntryForm.css";
import { useAuth0 } from "@auth0/auth0-react";

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
     const { getAccessTokenSilently, isAuthenticated} = useAuth0();

    const [editingInvestment, setEditingInvestment] = useState(null);


    useEffect(() => {
            const fetchInvestments = async () => {
                try {
                    const token = await getAccessTokenSilently();
                    const res = await fetch("http://localhost:5000/api/stocks", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });                
                    const data = await res.json();
                    setInvestment(data);
                } catch (err) {
                    console.error("Error fetching investments: ", err);
                }
            };
            if (isAuthenticated) {
                fetchInvestments();
            }
        }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewInvestment((prev) => ({ ...prev, [name]: value }));
    };

    const addInvestment = async () => {
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


        try {
            const token = await getAccessTokenSilently();
            const res = await fetch("http://localhost:5000/api/stocks",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...newInvestment,
                    type: newInvestment.type,
                    amount: newInvestment.amount,
                    currency: newInvestment.currency,
                    contributionInterval: newInvestment.contributionInterval,
                    contributionAmount: newInvestment.contributionAmount,
                    avarageValue: newInvestment.avarageValue,
                    DoP: newInvestment.DoP,
                    
                }),
            });
            if (!res.ok) {
                const errorText = await res.text();
                console.log("SERVER ERROR:", errorText); 
                throw new Error("Failed to save investments");
            }

            const savedInvestments = await res.json();
            setInvestment(prev => [...prev, savedInvestments]);
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
        } catch (err) {
            console.error("Error adding Investments: ", err);
        }
    };
        

        
    

    const removeInvestment = async (id) => {
        try {
            const token = await getAccessTokenSilently();
            await fetch(`http://localhost:5000/api/stocks/${id}`, {
                method: "DELETE",
                headers: { 
                    Authorization: `Bearer ${token}`,
                }
            });
            setInvestment(prev => prev.filter(investment => investment.id !== id));
            showSuccess("Investments removed successfully!");
        } catch (err) {
            console.error("Error deleting investments: ", err);
        }
    };

    const handleUpdateInvestments = async () => {
        try {
            const token = await getAccessTokenSilently();
            const res = await fetch(`http://localhost:5000/api/stocks/${editingInvestment.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editingInvestment),
                }
            );
            if (!res.ok) throw new Error("Failed to update");
            const updated = await res.json();
        
            setInvestment((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
            showSuccess("Investments updated successfully!");
            setEditingInvestment(null);
        } catch (err) {
          console.error("Update Error: ", err);
        }
        
    };

    const buyDate = new Date(newInvestment.DoP);
    if (buyDate > new Date()) {
        showWarning("Buy date cannot be in the future.");
        return;
    }


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

                <button onClick={addInvestment} style={buttonAddStyle}>
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
                            <tr key={investment.id}>
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
                                    onClick={() => setEditingInvestment(investment)}
                                    style={buttonEditStyle}
                                    >
                                        <AiOutlineEdit />
                                </button>
                            </td>
                            <td>
                                <button
                                onClick={() => removeInvestment(investment.id)}
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

            {editingInvestment && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h3 style={{ 
                            display: "flex", 
                            justifyContent: "center", 
                            alignContent: "center", 
                            fontSize: "1.25rem",
                        }}>
                            Edit Investments
                    
                            <button
                                onClick={() => setEditingInvestment(null)}
                                style={{ 
                                gap:"2rem", 
                                fontSize: "1.25rem", 
                                color: "red", 
                                backgroundColor: "#1e1e1e", 
                                border: "none",
                                cursor: "pointer",
                                }}
                            >
                                ✕
                            </button>

                        </h3>
            

                        <div style={formGroupStyle}>
                            <label>Name</label>
                            <input
                                type="text"
                                value={editingInvestment.name}
                                onChange={(e) => setEditingInvestment({ ...editingInvestment, name: e.target.value })}
                                style={inputStyle}
                            />
                        </div>
                        
                        <div style={formGroupStyle}>
                            <label>Type</label>
                            <select  
                                value={editingInvestment.type}
                                onChange={(e) => setEditingInvestment({ ...editingInvestment, type: e.target.value })}
                                style={{
                                    ...inputStyle,
                                    backgroundColor: "#1e1e1e",
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

                        <div style={formGroupStyle}>
                            <label>Amount</label>
                            <input  
                                type="number"
                                value={editingInvestment.amount}
                                onChange={(e) => setEditingInvestment({ ...editingInvestment, amount: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label>Currency</label>
                            <select  
                                value={editingInvestment.currency}
                                onChange={(e) => setEditingInvestment({ ...editingInvestment, currency: e.target.value })}
                                style={{
                                    ...inputStyle,
                                    backgroundColor: "#1e1e1e",
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

                        <div style={formGroupStyle}>
                            <label>Currency</label>
                            <select  
                                value={editingInvestment.contributionInterval}
                                onChange={(e) => setEditingInvestment({ ...editingInvestment, contributionInterval: e.target.value })}
                                style={{
                                    ...inputStyle,
                                    backgroundColor: "#1e1e1e",
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

                        <div style={formGroupStyle}>
                            <label>Contribution Amount</label>
                            <input  
                                type="number"
                                value={editingInvestment.contributionAmount}
                                onChange={(e) => setEditingInvestment({ ...editingInvestment, contributionAmount: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label>Avarage Value</label>
                            <input  
                                type="number"
                                value={editingInvestment.avarageValue}
                                onChange={(e) => setEditingInvestment({ ...editingInvestment, avarageValue: e.target.value })}
                                style={inputStyle}
                            />
                        </div>

                        <div style={formGroupStyle}>
                            <label>Date of Purchase</label>
                            <input  
                                type="date"
                                value={editingInvestment.DoP}
                                onChange={(e) => setEditingInvestment({ ...editingInvestment, DoP: e.target.value })}
                                style={inputStyle}
                            />
                        </div>


                        <div style={{ display: "flex", justifyContent: "center", alignItems:"center", gap: "10px", marginTop: "20px" }}>
                            <button onClick={handleUpdateInvestments} style={{
                                backgroundColor: "#9cff66",
                                border: "#000",
                                borderRadius: "20px",
                                padding: "10px 20px",
                                fontWeight: "bold",
                                color: "#000",
                                fontSize: "1.2rem",
                                cursor: "pointer",
                            }}>
                                Save
                            </button>

                        
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle = {
  backgroundColor: "#1e1e1e",
  padding: "2rem",
  borderRadius: "15px",
  width: "400px",
  display: "flex",
  flexDirection: "column",
};

const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
  marginBottom: "12px",
  textAlign: "left",
  color: "#9cff66",
  fontSize: "0.9rem",
  borderBottom: "0.5px dashed white"
};


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

const buttonEditStyle = {
  backgroundColor: "#6ce5e8",
  border: "none",
  borderRadius: "50%",
  color: "#000",
  fontSize: "1.2rem",
  width: "30px",
  height: "30px",
  cursor: "pointer",
  marginRight: "5px",
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

