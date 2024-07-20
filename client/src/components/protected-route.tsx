import { pb } from "@/lib/pocketbase";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  if (!pb.authStore.isValid) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
