import React from "react";
import renderer from "react-test-renderer";

import { getRandomMove, getMonteCarloMove, evaluate } from "../components/AI";
import Game, { gamestartStats } from "../components/Game";

import { shallow } from "enzyme";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { isClickAble } from "./testUtil";
import Tree from "../components/util/Tree";
import Field from "../components/util/Field";

configure({ adapter: new Adapter() });
describe("AI ", () => {
  test("random AI", () => {
    const game = shallow(<Game clock={false} renderInfo={true} />);
    const instance = game.instance();

    const data = {
      ...instance.state,
    };

    const move = getRandomMove(data);

    expect(move).not.toBe(null);
  });

  test("monte Carlo AI", () => {
    const game = shallow(<Game clock={false} renderInfo={true} />);
    const instance = game.instance();

    const data = {
      ...instance.state,
    };

    const move = getMonteCarloMove(data, parseFloat("100"));
    expect(move).not.toBe(null);
  });

  test("MonteCarlo make Winning move", () => {
    const game = renderer.create(
      <Game key={0} size={3} clock={false} time={10} renderInfo={true} />
    );

    const instance = game.root;
    const squares = instance.findAll((el) => el.props.className === "square");
    expect(squares.filter((x) => isClickAble(x)).length).toBe(81);

    squares[3].props.onClick();
    letCurrentPlayerWin(squares);
    let move = getMonteCarloMove(instance.instance.state, 1000);

    expect(isClickAble(squares[move.inner_idx + move.outer_idx * 9])).toBe(
      true
    );
    expect(move.inner_idx + move.outer_idx * 9).toBe(53);
  });

  function letCurrentPlayerWin(squares) {
    const indexes = [
      33,
      57,
      34,
      66,
      35,
      75,
      42,
      58,
      43,
      67,
      44,
      76,
      51,
      59,
      52,
      68,
      //      53,
    ];
    indexes.forEach((x) => squares[x].props.onClick());
  }

  describe("getMonteCarloMove()", () => {
    describe("evaluate()", () => {
      const tree = new Tree(gamestartStats, null, null, Date.now());
      for (let i = 0; i < 10; i++) {
        evaluate(tree);
      }

      test("simulationCount", () => {
        expect(tree.simulationCount).toBe(10);
        expect(
          tree.nodes.reduce((total, n) => total + n.simulationCount, 0)
        ).toBe(10);
      });

      test("mostUsedNode", () => {
        let node = tree.getMostUsed();
        expect(node.hasChildren()).toBe(true);
      });

      test("propagate", () => {
        let node = tree;
        while (node.hasChildren()) {
          node = node.getBestNode();
        }
        if (!node.isOver()) {
          node.makeChildren();
          node = node.getRandomChild();
        }
        let result = Field.propagate(node);
        node.update(result);
        expect(true).toBe(true);
      });
    });
  });
});
