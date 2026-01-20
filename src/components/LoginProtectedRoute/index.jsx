import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { URLS } from "../../urls";

// UI ko attractive banane ke liye hum ek simple Loader component use karenge
const PageLoader = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f8fafc' // Modern light background
  }}>
    <div className="animate-spin" style={{
      width: '40px',
      height: '40px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #6366f1', // Indigo primary color
      borderRadius: '50%'
    }}></div>
  </div>
);

const LoginProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const auth = localStorage.getItem("token");
  
  const roles = localStorage.getItem("roles")
    ? JSON.parse(localStorage.getItem("roles"))
    : [];

  useEffect(() => {
    // Chhota sa delay taaki UI transition smooth lage
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <PageLoader />;
  }

  return auth ? (
    <Navigate
      to={
        roles.includes("USER")
          ? URLS.USERS
          : roles.includes("ADMIN")
          ? URLS.ADMIN
          : URLS.TRAINERS_DASHBOARD
      }
      replace // Browser history clean rakhne ke liye
    />
  ) : (
    <div className="fade-in-animation">
        {children}
    </div>
  );
};

export default LoginProtectedRoute;