import { userState } from "@/atoms/user.atom";
import { pb } from "@/lib/pocketbase";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";

export const ProtectedRoute = () => {
  const user = useRecoilValue(userState);

  if (!user?.id) {
    // user is not authenticated
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
