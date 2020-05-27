import { getMoves } from "../util/GameUtil";

export function getRandomMove(data) {
  let moves = getMoves(data);
  return random_item(moves);
}

function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getMonteCarloMove(data) {
  const tree = new Tree(data);
  evaluateMoves(tree, data.time);
  return tree.getMostUsed();
}

class Tree {
  moves = [];
  constructor(data) {
    this.moves = getMoves(data);
  }
}

function evaluateMoves(tree, time) {
  const startTime = Date.now();
  while (Date.now() - startTime < time) {
    evaluateMove(tree);
  }
}

function evaluateMove(tree) {
  // start 0 start 1: pick a move
  // expand move
  // repeat 0 until no more move
  // give move children
  // make random move until end
  // update evaluatiom
}
