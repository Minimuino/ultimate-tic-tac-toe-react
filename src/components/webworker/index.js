import { expose } from "comlink";
import { getAIMove } from "../AI";

export const exports = {
  getAIMove,
};
expose(exports);
