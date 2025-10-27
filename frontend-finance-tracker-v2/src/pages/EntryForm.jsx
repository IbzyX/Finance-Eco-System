import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./css/EntryForm.css";

export default function Entry() {
    const [isTrueLayerConnected, setIsTrueLayerConnected] = useState(false);

    useEffect(() => {
        const connected = localStorage.getItem("truelayer_connected") === "true";
        setIsTrueLayerConnected(connected);
    }, []);

    const handleDisconnect = () => {
        localStorage.removeItem("truelayer_connected");
        setIsTrueLayerConnected(false);

        window.dispatchEvent(new Event("storage"));
    };

    const handleConnect = () => {
        localStorage.setItem("truelayer_connected", "true");
        setIsTrueLayerConnected(true);
        
        window.dispatchEvent(new Event("storage"));
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
                <form className="entry-form">
                    


                    <button onClick={handleConnect}>Simulate Connect</button>
                </form>
            )}
        </section>
    );
}
