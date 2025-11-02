import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TrueLayerCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URLSearchParams(window.location.search).get("code");
        if (!code) return;

            fetch(`${import.meta.env.VITE_API_URL}/api/truelayer/exchange`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
            credentials: "include",
        })
        .then((res) => res.json())
        .then(() => {
            localStorage.setItem("truelayer_connected", "true");
            navigate("/dashboard");
        });
    }, []);

    return <p style={{ color: "white" }}>Connecting to bank...</p>;
}
