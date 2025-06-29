import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div >
        <h1 style={{ fontWeight: "700", marginBottom: "16px" }}>404</h1>
        <p style={{ marginBottom: "16px" }}>Oops! Page not found</p>
        <a href="/" >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
