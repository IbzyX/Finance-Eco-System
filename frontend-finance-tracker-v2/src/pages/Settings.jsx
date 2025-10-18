import { Link } from "react-router-dom";
import "./css/Settings.css";

export default function Settings() {
  return (
    <section>
        <h1>Settings</h1>
        <p>Change preferences or manage account here.</p>
        
        <Link to="/" className="Home-btn">Home</Link>
    </section>

  );
}
