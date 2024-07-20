import { pb } from "@/lib/pocketbase";

export function loginWithPassword(email: string, password: string) {
  return pb.collection("users").authWithPassword(email, password);
}

export function logout() {
  pb.authStore.clear();
}
