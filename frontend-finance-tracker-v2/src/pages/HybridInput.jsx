import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";


export default function Entry() {
    const [hoveredItem, setHoveredItem] = useState(null);
    const [file, setFile] = useState(null);
    const [showClassifier, setShowClassifier] = useState(false);
    const [parsedRows, setParsedRows] = useState([]);

    const handleFileUpload = (pdfFile) => {
        if (!pdfFile) return;

        setFile(pdfFile);

        const mockparsed = [
            { description: "Salary", amount: 2500, category: "income" },
            { description: "Mortage", amount: -900, category: "bill" },
            { description: "Groceries", amount: -100, category: "expense" },
        ];
        setParsedRows(mockparsed);
        setShowClassifier(true);
    }
    
    return (
        <div style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "20",
        }}>
            <div style={{
                backgroundColor: "#222",
                padding: "2rem 3rem",
                borderRadius: "12px",
                textAlign: "center", 
                maxWidth: "400px",
                boxShadow: "0 0 20px rgba(0,0,0, 0.4)",
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem"
                }}>
                    <h2 style={{ 
                        color: "#00e676", 
                        margin: 0, 
                        marginLeft: "2rem",
                        flexGrow: 1, 
                        textAlign: "center" 
                    }}>
                        Hybrid Input
                    </h2>

                    <Link 
                        to="/entry"
                        style={{
                            background: "none",
                            border: "none",
                            color: "#ff5252",
                            fontSize: "1.4rem",
                            cursor: "pointer",
                            textDecoration: "none",
                            width: "24px",
                            textAlign: "left",
                        }}
                    >
                        ✕
                    </Link>

                    <div style={{ width: "24px" }}></div>
                </div>



                
                <p>Upload your bank statement to speed up input process</p>

                <input
                    type="file"
                    accept="application/pdf"
                    style={{ display: "none" }}
                    id="pdf-upload"
                    onChange={(e) => handleFileUpload(e.target.files[0])}
                />
                <button 
                    style={{
                        marginTop: "1rem",
                        padding: "0.75rem 1.5rem",
                        border: "none",
                        borderRadius: "6px",
                        backgroundColor: "#00e676",
                        fontSize: "1.2rem",
                        textDecoration: "underline",
                        fontWeight: "bold",
                        cursor: "pointer",
                         
                    }}
                    onClick={() => document.getElementById("pdf-upload").click()}>
                    Upload
                </button>


                <div style={{display:"flex", alignItems:"center", justifyContent: "center" ,gap: "0.5rem"}}>
                    <AiOutlineInfoCircle style={{color: "#555", fontSize:"1.5rem"}} />
                    <span style={{color:"#555", margin: "1rem 0 1rem 0"}}>Please submit as a PDF</span> 
                </div>
            </div>
           {showClassifier && (
                <div
                    style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 30,
                    }}
                >
                    <div
                    style={{
                        background: "#222",
                        padding: "2rem",
                        borderRadius: "12px",
                        width: "500px",
                        color: "white",
                    }}
                    >
                    <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
                        Classify Transactions
                    </h3>

                    {parsedRows.map((row, i) => (
                        <div
                        key={i}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr",
                            gap: "0.5rem",
                            marginBottom: "0.5rem",
                            alignItems: "center",
                        }}
                        >
                        <span>{row.description}</span>
                        <span>£{row.amount}</span>

                        <select
                            value={row.category}
                            onChange={(e) => updateCategory(i, e.target.value)}
                        >
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                            <option value="savings">Savings</option>
                        </select>
                        </div>
                    ))}

                    <button
                        onClick={saveClassifiedData}
                        style={{
                        marginTop: "1rem",
                        width: "100%",
                        padding: "0.75rem",
                        background: "#00e676",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        }}
                    >
                        Save Data
                    </button>
                    </div>
                </div>
            )}
        </div>     
    )
}
   