import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { Spinner } from "./Spinner";

export const PrivateRoute = () => {
  const { logIn, checkStatus } = useAuthStatus();

  if (checkStatus) {
    return <Spinner />
  }
  return logIn ? <Outlet /> : <Navigate to="/sign-in" />;
};
