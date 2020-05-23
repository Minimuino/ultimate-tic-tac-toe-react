import React from "react";
import { getAIMove } from "../components/AI";
import Game from "../components/Game";

import { shallow } from "enzyme";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("AI test", () => {
  test("AI", () => {
    const game = shallow(<Game clock={false} renderInfo={true} />);
    const instance = game.instance();

    const data = {
      squares: instance.state.squares,
      localWinners: instance.state.localWinners,
      lastMoveLocation: instance.state.lastMoveLocation,
    };

    const move = getAIMove(data);

    expect(move).not.toBe(null);
  });
});
