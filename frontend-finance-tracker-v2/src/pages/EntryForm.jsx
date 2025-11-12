import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

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

    const handleConnect = () => {
        localStorage.setItem("truelayer_connected", "true");
        setIsTrueLayerConnected(true);
        
        window.dispatchEvent(new Event("storage"));
    };

    const handleDisconnect = () => {
        localStorage.removeItem("truelayer_connected");
        setIsTrueLayerConnected(false);

        window.dispatchEvent(new Event("storage"));
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
                                    backgroundColor: hoveredItem === "truelayer" ?  "#e600adff" : "#ff72c7ff" ,
                                    color: "Black",
                                    fontWeight: "bold",
                                    textDecoration: "underline",
                                    borderRadius: "20px",
                                    border: "2px solid black",
                                    fontSize: "1.5rem",
                                    padding: "15px 20px",
                                    width: "100%",
                                }}
                                //onClick={connectBank} 
                                onClick={handleConnect}
                                onMouseEnter={() => setHoveredItem("truelayer")}
                                onMouseLeave={() => setHoveredItem(false)}
                            >
                                Simulate TrueLayer 
                            </button>

                            <Link to="/hybrid" 
                            style={{
                                display: "block",
                                    backgroundColor: hoveredItem === "hybrid" ?  "#00e676" : "#c1ff72" ,
                                    color: "Black",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                    textDecoration: "underline",
                                    borderRadius: "20px",
                                    border: "2px solid black",
                                    margin: "0.5rem",
                                    fontSize: "1.5rem",
                                    padding: "12px 22px",
                                    width: "85%",
                            }}
                            onMouseEnter={() => setHoveredItem("hybrid")}
                            onMouseLeave={() => setHoveredItem(false)}
                        >
                            Switch to Hybrid
                        </Link>

                        </aside>


                       


                    
                        <main className="content-area">{renderContent()}</main>
                    </div>
                </div>
            )}
        </section>
    );
}
