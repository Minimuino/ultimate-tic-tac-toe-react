import React from "react";
import Game from "../components/Game";

import renderer from "react-test-renderer";

import { containsXorO, isClickAble } from "./testUtil";

describe("onclick", () => {
  test("current: makeon click", () => {
    const game = renderer.create(
      <Game key={0} size={3} clock={false} time={10} renderInfo={true} />
    ); // only renders the first lvl

    const instance = game.root;
    const squares = instance.findAll((el) => el.props.className === "square");
    expect(squares.filter((x) => containsXorO(x.props.children)).length).toBe(
      0
    );

    squares[0].props.onClick();
    expect(squares.filter((x) => containsXorO(x.props.children)).length).toBe(
      1
    );
    expect(instance.findByProps({ id: "status" }).props.children).toEqual(
      "Next player: O"
    );
    //geht doch ...
  });
  test("victory x", () => {
    const game = renderer.create(
      <Game key={0} size={3} clock={false} time={10} renderInfo={true} />
    );

    const instance = game.root;
    const squares = instance.findAll((el) => el.props.className === "square");
    expect(squares.filter((x) => isClickAble(x)).length).toBe(81);

    letCurrentPlayerWin(squares);

    expect(squares.filter((x) => isClickAble(x)).length).toBe(0);
    expect(instance.findByProps({ id: "status" }).props.children).toEqual(
      "X wins!"
    );
  });

  test("victory O", () => {
    const game = renderer.create(
      <Game key={0} size={3} clock={false} time={10} renderInfo={true} />
    );

    const instance = game.root;
    const squares = instance.findAll((el) => el.props.className === "square");
    expect(squares.filter((x) => isClickAble(x)).length).toBe(81);

    squares[3].props.onClick();
    letCurrentPlayerWin(squares);

    expect(squares.filter((x) => isClickAble(x)).length).toBe(0);
    expect(instance.findByProps({ id: "status" }).props.children).toEqual(
      "O wins!"
    );
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
      53,
    ];
    indexes.forEach((x) => squares[x].props.onClick());
  }

  //test new game

  /*    test("future: ai is O", () => {
                //enzym would be shallow .instance
            const inst = ReactTestUtils.renderIntoDocument(<Game key={0}
                size={3}
                clock={false}
                time={10}
                renderInfo={true}
                aiIs={'O'} />); // only renders the first lvl
            expect(inst.state.squares.filter(x => containsXorO(x)).length).toBe(0)
    
            inst.handleClick(0, 8)
            expect(inst.state.squares.filter((x) => containsXorO(x)).length).toBe(2)
            expect(inst.state.xIsNext).toBe(true)
        });*/
});
