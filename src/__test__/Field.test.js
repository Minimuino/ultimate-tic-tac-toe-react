import React from "react";
import Game from "../components/Game";

import Field from "../components/util/Field";

import { shallow } from "enzyme";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });

describe("Field: ", () => {
  test("getMoves", () => {
    const game = shallow(<Game></Game>).instance();
    expect(Field.getMoves(game.state).length).toBe(81);
    game.handleClick(Field.getMove(1, 0));
    expect(Field.getMoves(game.state).length).toBe(9);
  });
  /*
  test("makeMove", () => {
    const game = shallow(<Game></Game>).instance();
    expect(game.state.squares.filter((x) => containsXorO(x)).length).toBe(0);
    expect(game.getMoves().length).toBe(81);
    game.makeAIMove();
    expect(game.state.squares.filter((x) => containsXorO(x)).length).toBe(1);
  });*/
});
