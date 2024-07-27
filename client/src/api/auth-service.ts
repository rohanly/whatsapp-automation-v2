import { User } from "@/types";
import API from ".";

export async function loginWithPassword(email: string, password: string) {
  const res = await API.post("/api/auth/login", { email, password });
  return res.data;
}

export async function logout() {
  const res = await API.post("/api/auth/logout", {});
  return res.data;
}

export async function getUser(): Promise<User> {
  const res = await API.get("/api/sessions/me");
  return res.data;
}
