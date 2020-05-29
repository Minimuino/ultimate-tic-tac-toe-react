import React from "react";
import { getRandomMove, getMonteCarloMove } from "../components/AI";
import Game from "../components/Game";

import { shallow } from "enzyme";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("AI test", () => {
  test("random AI", () => {
    const game = shallow(<Game clock={false} renderInfo={true} />);
    const instance = game.instance();

    const data = {
      squares: instance.state.squares,
      localWinners: instance.state.localWinners,
      lastMoveLocation: instance.state.lastMoveLocation,
    };

    const move = getRandomMove(data);

    expect(move).not.toBe(null);
  });

  test("monte Carlo AI", () => {
    const game = shallow(<Game clock={false} renderInfo={true} />);
    const instance = game.instance();

    const data = {
      squares: instance.state.squares,
      localWinners: instance.state.localWinners,
      lastMoveLocation: instance.state.lastMoveLocation,
      xIsNext: instance.state.xIsNext,
    };

    const move = getMonteCarloMove(data, parseFloat("100"));
    console.log(move);
    expect(move).not.toBe(null);
  });
});
