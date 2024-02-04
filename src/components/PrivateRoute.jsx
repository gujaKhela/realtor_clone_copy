import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";

export const PrivateRoute = () => {
  const { logIn, checkStatus } = useAuthStatus();

  if (checkStatus) {
    return <h3>Loading ...</h3>;
  }
  return logIn ? <Outlet /> : <Navigate to="/sign-in" />;
};
