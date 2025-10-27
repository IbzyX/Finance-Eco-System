import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";


export default function inputType () {

    const [hoveredItem, setHoveredItem] = useState(null);


    return (
        <div> 
            <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            width: "100%",
            marginTop: "6rem",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1rem",
            fontWeight: "bold",
            }}>
                <div style={{borderRight:"3px solid #666"}}>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#cbcbcb",
                        borderRadius: "10px",
                        padding: "0 0 3rem 0",
                        width: "80%",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "3rem 0 3rem 3rem"

                    }}>
                        <h2 style={{color:"black", textDecoration: "underline", fontSize:"1.5rem"}}>Manual</h2>
                        <p style={{
                            display: "flex",
                            textAlign: "center",
                            margin: "1rem",
                            fontSize: "1rem", 
                            color: "#555", 
                        }}>
                            Manually enter your infomation for detailed widget insight
                        </p>

                        <Link to="/entry" 
                            style={{
                                display: "block",
                                backgroundColor: hoveredItem === "entry" ? "lime" : "#00e676",
                                textDecoration: "none",
                                borderRadius: "10px",
                                border: "2px solid black",
                                margin: "2rem",
                                fontSize: "1.5rem",
                                padding: "10px 15px",
                            }}
                            onMouseEnter={() => setHoveredItem("entry")}
                            onMouseLeave={() => setHoveredItem(false)}
                        >
                            Entry Form
                        </Link>
                        
                    </div>
                </div>


                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "#cbcbcb",
                    borderRadius: "10px",
                    width: "80%",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: "3rem",
                }}>
                    <h2 style={{color:"black", textDecoration: "underline", fontSize:"1.5rem"}}>Auto</h2>
                    <p style={{
                        display: "flex",
                        textAlign: "center",
                        margin: "1rem",
                        fontSize: "1rem", 
                        color: "#555", 
                    }}>
                        Connects accounts to automatically update real-time
                    </p>

                    <Link to="/entry" 
                        style={{
                            display: "block",
                            backgroundColor: hoveredItem === "truelayer" ? "lime" : "#00e676",
                            textDecoration: "underline",
                            borderRadius: "10px",
                            border: "2px solid black",
                            margin: "2rem",
                            fontSize: "1.5rem",
                            padding: "10px 15px",
                        }}
                        onMouseEnter={() => setHoveredItem("truelayer")}
                        onMouseLeave={() => setHoveredItem(false)}
                    >
                        TrueLayer Link
                    </Link>
                    <div style={{display:"flex", alignItems:"center", gap: "0.5rem"}}>
                        <AiOutlineInfoCircle style={{color: "#555", fontSize:"1.5rem"}} />
                        <span style={{color:"#555", margin: "1rem 0 1rem 0"}}> TrueLayer API is FCA authorized </span> 
                    </div>                    
                </div>

            </div>
        </div>
        
    );
}