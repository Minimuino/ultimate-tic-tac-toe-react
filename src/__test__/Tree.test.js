import Tree from "../components/util/Tree";
import { gamestartStats } from "../components/Game";
import { evaluate } from "../components/AI";
import { Results } from "../components/util/Field";

describe("Tree", () => {
  const tree = new Tree(gamestartStats, null, null, Date.now());

  test("hasChildren", () => {
    expect(tree.hasChildren()).toBe(false);
  });

  test("makeChildren", () => {
    tree.makeChildren();
    expect(tree.nodes.length).toBe(81);
  });

  test("getBestNode", () => {
    let node = tree.nodes[0];
    node.score = 1000;
    node.simulationCount = 1;
    expect(tree.getBestNode()).toBe(node);
  });

  test("update", () => {
    let node = tree.nodes[0];
    node.makeChildren();
    node.nodes[0].update(Results.VICTORY);
    expect(node.simulationCount).toBe(1);
    expect(node.score <= 0).toBe(true);
    expect(tree.score).toBe(1);
    expect(tree.simulationCount).toBe(1);
  });
});
