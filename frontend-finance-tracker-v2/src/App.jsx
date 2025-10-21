import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

export default function App() {
  const location = useLocation();

  const hideNavbar = ["/login"].includes(location.pathname);

  return (
    <>
      <div className="app-container">
        {!hideNavbar && <Navbar />}
        <main>
          <Outlet />
        </main>
        
      </div>
    </>
  );
}
