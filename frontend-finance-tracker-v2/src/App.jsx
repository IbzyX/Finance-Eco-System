import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnHover
          />
      </div>
    </>
  );
}
