import { People } from "@/types";
import { atom } from "recoil";

export const peopleState = atom<People | undefined>({
  key: "peopleState",
  default: undefined,
});
