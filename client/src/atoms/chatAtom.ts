import { atom } from "recoil";

export const activeChatState = atom<string>({
  key: "activeChatState",
  default: undefined,
});
