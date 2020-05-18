import React from "react";
import Game from "../components/Game";
import { containsXorO } from "./testUtil";
import { shallow } from "enzyme";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Game: makeAIMove", () => {
  test("getMoves", () => {
    const game = shallow(<Game></Game>).instance();
    expect(game.getMoves().length).toBe(81);
    game.handleClick(0, 1);
    expect(game.getMoves().length).toBe(9);
  });

  test("makeMove", () => {
    const game = shallow(<Game></Game>).instance();
    expect(game.state.squares.filter((x) => containsXorO(x)).length).toBe(0);
    expect(game.getMoves().length).toBe(81);
    game.makeAIMove();
    expect(game.state.squares.filter((x) => containsXorO(x)).length).toBe(1);
  });
});
