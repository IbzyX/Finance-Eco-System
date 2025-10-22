import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { showLogout } from "../utils/toast";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth0();
  
  // logout alert
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showLogout("You've been logged out.");
    }
  }, [isAuthenticated, isLoading]);


  return (
    <section>
      <h1>Home Page</h1>
      <p>Welcome to the Finance Tracker!</p>
    </section>
  );
}
