import { getUser } from "@/api/auth-service";
import { userState } from "@/atoms/user.atom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useRecoilState } from "recoil";

function Root() {
  const [user, setUser] = useRecoilState(userState);

  const { data, isLoading } = useQuery({
    queryKey: ["getUser"],
    queryFn: async () => {
      const data = await getUser();
      setUser(data);
      return data;
    },
    retry: 0,
    refetchInterval: 0,
  });

  if (isLoading) {
    return <p>loading...</p>;
  }

  return <Outlet />;
}
export default Root;
