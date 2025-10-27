import React, { useState, useEffect } from "react";

export default function Themes() {
    const [activeTheme, setActiveTheme] = useState(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) setActiveTheme(savedTheme);
    }, []);

    const themes = [
        {
            name: "Dark Mode",
            key: "dark",
            type: "dark", 
        },
        {
            name: "System Theme",
            key: "system",
            type: "system",
        },
        {
            name: "Light Mode",
            key: "light",
            type: "light",
        },
    ];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {themes.map((theme, index) => (
                <div
                    key={theme.key}
                    style={{
                        borderRight:
                            index !== themes.length - 1 ? "3px solid #666" : "none",
                        textAlign: "center",
                    }}
                >
                    <h2
                        style={{
                            color: "white",
                            textDecoration: "underline",
                            fontSize: "1.5rem",
                            marginBottom: "1.5rem",
                        }}
                    >
                        {theme.name}
                    </h2>

                    <div
                        onClick={() => setActiveTheme(theme.key)}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            borderRadius: "10px",
                            padding: "3rem 0",
                            width: "80%",
                            alignItems: "center",
                            justifyContent: "center",
                            marginLeft: "2rem",
                            marginBottom: "3rem",
                            cursor: "pointer",
                            transition: "transform 0.25s ease, box-shadow 0.25s ease",

                            transform:
                                activeTheme === theme.key ? "scale(1.05)" : "scale(1)",
                            boxShadow:
                                activeTheme === theme.key
                                    ? "0 0 0 4px #00e676, 0 0 15px #00ff84ff"
                                    : "none",

                            background:
                                theme.type === "system"
                                    ? "linear-gradient(135deg, #111 0%, #111 50%, #cbcbcb 50%, #cbcbcb 100%)"
                                    : theme.type === "dark"
                                    ? "#111"
                                    : "#cbcbcb",
                        }}
                    >
                        <div
                            style={{
                                borderRadius: "15px 0 0 15px",
                                width: "80%",
                                padding: "7rem 0",
                                marginLeft: "3.5rem",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.4)",

                                background:
                                    theme.type === "system"
                                        ? "linear-gradient(135deg, #444 0%, #444 50%, #fff 50%, #fff 100%)"
                                        : theme.type === "dark"
                                        ? "#444"
                                        : "#fff",
                            }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
