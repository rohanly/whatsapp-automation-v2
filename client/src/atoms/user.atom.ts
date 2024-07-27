import { User } from "@/types";
import { atom } from "recoil";

export const userState = atom<User | undefined>({
  key: "userState",
  default: undefined,
});
