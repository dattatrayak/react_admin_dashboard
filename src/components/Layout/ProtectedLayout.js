import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  const isAuthenticated = localStorage.getItem("auth");
  
  if (!isAuthenticated) { 
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedLayout;
