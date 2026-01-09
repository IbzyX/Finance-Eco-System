import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";
import * as pdfjslib from "pdfjs-dist";
import pdfWorker from "pdfjs-dist/build/pdf.worker?url";

pdfjslib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function HybridEntry() {
    const [file, setFile] = useState(null);
    const [showClassifier, setShowClassifier] = useState(false);
    const [parsedRows, setParsedRows] = useState([]);

    const handleFileUpload = async (pdfFile) => {
        if (!pdfFile) return;

        setFile(pdfFile);

        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjslib.getDocument({ data: arrayBuffer }).promise;

        let textLines = [];
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();

            const pageText = content.items
                .map(item => item.str)
                .join(" ");

            textLines.push(pageText);
        }

        const parsed = parseBankStatement(textLines.join("\n"));

        setParsedRows(parsed);
        setShowClassifier(true);

    };

    function parseBankStatement(text) {
        const lines = text.split("\n");

        const rows = [];

        lines.forEach(line => {
            const amountMatch = line.match(/-?\£?\d+(\.\d{2})?/);
            if (!amountMatch) return;

            const amount = parseFloat(amountMatch[0].replace("£", ""));
            const description = line.replace(amountMatch[0], "").trim();

            rows.push({
                description: description || "Unknown",
                amount,
                category: amount > 0 ? "income" : "expense",
            });
        });

        return rows;
    }
    function parseNationwideStandard(text) {
        const lines = text
            .split("\n")
            .map(l => l.trim())
            .filter(l => l.length > 0);

        const tx = [];

        const dateRegex = /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i;

        const amountRegex = /\£?\d{1,3}(,\d{3})*(\.\d{2})/;

        let buffer = null;

        for (const line of lines) {

            if (/balance|money in|money out|date|opening|closing|statement/i.test(line)) {
                continue;
            }

            if (dateRegex.test(line)) {
                if (buffer) tx.push(buffer);

                const date = line.match(dateRegex)[0];
                const rest = line.replace(dateRegex, "").trim();

                buffer = {
                    date,
                    description: rest,
                    moneyIn: null,
                    moneyOut: null
                };

            } else if (buffer) {
                const parts = line.split(/\s+/);

                const amounts = parts.filter(p => amountRegex.test(p));
                if (amounts.length > 0) {
                    if (amounts.length === 3) {
                        buffer.moneyIn = parseFloat(amounts[0].replace(/,/g, ""));
                        buffer.moneyOut = parseFloat(amounts[1].replace(/,/g, ""));
                    }
                    else if (amounts.length === 2) {
                        buffer.moneyIn = parseFloat(amounts[0].replace(/,/g, ""));
                        buffer.moneyOut = parseFloat(amounts[1].replace(/,/g, ""));
                    }
                } else {
                    buffer.description += " " + line;
                }
            }
        }

        if (buffer) tx.push(buffer);

        return tx
            .filter(t => t.moneyIn !== null || t.moneyOut !== null)
            .map(t => ({
                date: t.date,
                description: t.description.trim(),
                amount: t.moneyIn ? t.moneyIn : -(t.moneyOut || 0),
                category: t.moneyIn ? "income" : "expense"
            }));
    }



    const updateRow = (idex, field, value) => {
        setParsedRows((prev) =>
            prev.map((row, i) =>
                i === idex ? { ...row, [field]: value } : row
            )
        );
    };

    const saveClassifiedData = () => {
        console.log("Final classified data: ", parsedRows)
        setShowClassifier(false);
    };
    
    return (
        <>
            {!showClassifier && (
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backdropFilter: "blur(5px)",
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 20,
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

                        <p>Upload your bank statement to skip input process</p>

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
                            onClick={() => document.getElementById("pdf-upload").click()}
                        >
                            Upload
                        </button>

                        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", alignItems: "center" }}>
                            <AiOutlineInfoCircle style={{ color: "#555", fontSize: "1.5rem" }} />
                            <span style={{ color: "#555", marginTop: "1rem" }}>Please submit as a PDF</span>
                        </div>
                    </div>
                </div>
            )}
            {showClassifier && (
                <div style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(0,0,0,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 30,
                }}>
                    <div style={{
                        background: "#222",
                        padding: "2rem",
                        borderRadius: "12px",
                        width: "550px",
                        color: "white",
                    }}>
                        <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
                            Review & Classify Transactions
                        </h3>

                        {parsedRows.map((row, i) => (
                            <div key={i} style={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr 1fr",
                                gap: "0.5rem",
                                marginBottom: "0.75rem",
                            }}>
                                <input
                                    value={row.description}
                                    onChange={(e) => updateRow(i, "description", e.target.value)}
                                />

                                <input
                                    type="number"
                                    value={row.amount}
                                    onChange={(e) => updateRow(i, "amount", Number(e.target.value))}
                                />

                                <select
                                    value={row.category}
                                    onChange={(e) => updateRow(i, "category", e.target.value)}
                                >
                                    <option value="income">Income</option>
                                    <option value="expense">Expense</option>
                                    <option value="bill">Bill</option>
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
        </>
    );
}
   