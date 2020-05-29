import Field, { Results } from "./Field";
export default class Tree {
  nodes = [];
  data = {};
  parent = undefined;
  move = undefined;
  score = 0;
  simulationCount = 0;
  initTime = undefined;

  constructor(data, parent, move, time) {
    if (data.xIsNext === undefined) {
      throw Error("Data of Tree does not contain X");
    }
    this.data = { ...data };
    this.parent = parent;
    this.move = move;
    this.initTime = time;
  }

  hasChildren = () => {
    return this.nodes.length > 0;
  };

  getBestNode = () => {
    this.sortTime = Date.now();
    return this.nodes.sort(this.compareNodes).reverse()[0];
  };

  compareNodes = (node1, node2) => {
    if (node1.getScore(this.sortTime) >= node2.getScore(this.sortTime)) {
      return 1;
    } else {
      return -1;
    }
  };

  getScore = (time) => {
    if (this.simulationCount === 0) {
      return 0.5 * Math.log10(Math.sqrt(time + 1 - this.initTime));
    } else {
      return (
        this.score / this.simulationCount +
        0.5 *
          Math.log10(Math.sqrt(time + 1 - this.initTime) / this.simulationCount)
      );
    }
  };

  makeChildren = () => {
    if (this.hasChildren()) {
      throw Error("makeChildren even due has children");
    }
    let moves = Field.getMoves(this);
    let time = Date.now();
    moves.forEach((move) => {
      let data = Field.getNextData(this.data, move);
      this.nodes.add(new Tree(data, this, move, time));
    });
  };

  getRandomChild = () => {
    return random_item(this.nodes);
  };

  update = (result) => {
    this.simulationCount++;
    if (result === Results.VICTORY) {
      this.score++;
      if (this.parent) {
        this.parent.update(Results.DEFEAT);
      }
    } else if (result === Results.DEFEAT) {
      if (this.score > 0) {
        this.score--;
      }
      if (this.parent) {
        this.parent.update(Results.VICTORY);
      }
    } else {
      this.parent.update(Results.DRAW);
    }
  };
}

function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}
