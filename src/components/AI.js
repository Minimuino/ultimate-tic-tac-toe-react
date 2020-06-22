import Field from "./util/Field";
import Tree from "./util/Tree";

export function getRandomMove(data) {
  let moves = Field.getMoves(data);
  return random_item(moves);
}

function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function getMonteCarloMove(data, time) {
  const tree = new Tree(data, null, null, Date.now());
  evaluateMoves(tree, time);
  return tree.getMostUsed().move;
}

function evaluateMoves(tree, time) {
  const startTime = Date.now();
  let x = 0;
  while (Date.now() - startTime < time) {
    evaluate(tree);
    x++;
  }
  console.log("Simulations: " + x);
}

export function evaluate(tree) {
  while (tree.hasChildren()) {
    tree = tree.getBestNode();
  }
  if (!tree.isOver()) {
    tree.makeChildren();
    tree = tree.getRandomChild();
  }
  let result = Field.propagate(tree);
  tree.update(result);
}
