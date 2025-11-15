import React, { useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineInfoCircle } from "react-icons/ai";


export default function Entry() {
    const [hoveredItem, setHoveredItem] = useState(null);
    
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
                    onClick={""}>
                    Upload
                </button>


                <div style={{display:"flex", alignItems:"center", justifyContent: "center" ,gap: "0.5rem"}}>
                    <AiOutlineInfoCircle style={{color: "#555", fontSize:"1.5rem"}} />
                    <span style={{color:"#555", margin: "1rem 0 1rem 0"}}>Please submit as a PDF</span> 
                </div>
            </div>         
        </div>
           
        
    )
}
   