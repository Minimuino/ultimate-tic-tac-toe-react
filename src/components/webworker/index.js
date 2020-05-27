import { expose } from "comlink";
import { getRandomMove, getMonteCarloMove } from "../AI";

export const exports = {
  getRandomMove,
  getMonteCarloMove,
};
expose(exports);
