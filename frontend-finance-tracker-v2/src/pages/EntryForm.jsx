import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

import "./css/EntryForm.css";
import EntryIncome from "../components/Entry/EntryIncome";
import EntrySavings from "../components/Entry/EntrySavings";
import EntryInvestments from "../components/Entry/EntryInvestments";
import EntryExpense from "../components/Entry/EntryExpense";
import EntryBills from "../components/Entry/EntryBills";
import EntryDebt from "../components/Entry/EntryDebt";


export default function Entry() {
    const [activeTab, setActiveTab] = useState("Income");
    const [hoveredItem, setHoveredItem] = useState(null);
    
    const { getAccessTokenSilently } = useAuth0();
    const [isTrueLayerConnected, setIsTrueLayerConnected] = useState(false);



    const connectBank = async () => {
        try {
            const token = await getAccessTokenSilently();

            const res = await fetch(`${import.meta.env.VITE_API_URL}/truelayer/connect`, {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include"
            });

            const url = await res.text();
            if (url.startsWith("https://")) window.location.href = url;
            else alert("Could not start TrueLayer connection");
        } catch (err) {
            console.error(err);
            alert("Could not start TrueLayer connection");
        }
        return isTrueLayerConnected = true;
    };




    const renderContent = () => {
        switch(activeTab) {
            case "Income":
                return <EntryIncome />;
            case "Savings":
                return <EntrySavings />;
            case "Investments":
                return <EntryInvestments />;
            case "Expense":
                return <EntryExpense />;
            case "Bills":
                return <EntryBills />;
            case "Debt":
                return <EntryDebt />;

            default:
                return <EntryIncome />;
        }
    };
    

    return (
        <section className="entry-page">
            <h1>Manual Entry Form</h1>

            {isTrueLayerConnected ? (
                <div className="blocker-overlay">
                    <div className="blocker-content">
                        <h2>Account Connected To TrueLayer</h2>
                        <p>
                            Your account is currently linked through Truelayer.
                            Manual entry is disabled to avoid duplicated data.
                        </p>
                        <button onClick={handleDisconnect}>Disconnect TrueLayer</button>
                    </div>
                </div>

            ) : (
                <div className="container">
                    <div className="Entry-wrapper">
                        <aside className="entry-sidebar">
                            <h2>Income</h2>


                            <button
                                className={`sidebar-btn ${activeTab === "Income" ? "active" : ""}`}
                                onClick={() => setActiveTab("Income")}>
                                Income
                            </button>

                            <button
                                className={`sidebar-btn ${activeTab === "Savings" ? "active" : ""}`}
                                onClick={() => setActiveTab("Savings")}>
                                Savings
                            </button>
                            
                            <button
                                className={`sidebar-btn ${activeTab === "Investments" ? "active" : ""}`}
                                onClick={() => setActiveTab("Investments")}>
                                Investments
                            </button>


                            <div className="divider"></div>
                            <h2>Expenditure</h2>


                            <button
                                className={`sidebar-btn ${activeTab === "Expense" ? "active" : ""}`}
                                onClick={() => setActiveTab("Expense")}>
                                Expense
                            </button>

                            <button
                                className={`sidebar-btn ${activeTab === "Bills" ? "active" : ""}`}
                                onClick={() => setActiveTab("Bills")}>
                                Bills
                            </button>

                            <button
                                className={`sidebar-btn ${activeTab === "Debt" ? "active" : ""}`}
                                onClick={() => setActiveTab("Debt")}>
                                Debt
                            </button>
                            
                            
                            <button
                                style={{
                                    display: "block",
                                    backgroundColor: hoveredItem === "truelayer" ?  "#00e676" : "#c1ff72" ,
                                    color: "Black",
                                    fontWeight: "bold",
                                    textDecoration: "underline",
                                    borderRadius: "20px",
                                    border: "2px solid black",
                                    margin: "1rem",
                                    fontSize: "1.5rem",
                                    padding: "15px 20px",
                                    width: "100%",
                                }}
                                onClick={connectBank} 
                                onMouseEnter={() => setHoveredItem("truelayer")}
                                onMouseLeave={() => setHoveredItem(false)}
                            >
                                TrueLayer Link
                            </button>

                        </aside>


                       


                    
                        <main className="content-area">{renderContent()}</main>
                    </div>
                </div>
            )}
        </section>
    );
}
