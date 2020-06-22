import { getRandomMove } from "../AI";
import { squareColors } from "../Square";

export default class Field {
  static getMoves(data) {
    let moves = [];
    data.localWinners.forEach((field, outer_idx) => {
      if (field === null && data.activeFields[outer_idx]) {
        data.squares[outer_idx].forEach((x, inner_idx) => {
          if (x === null) {
            moves.push(Field.getMove(inner_idx, outer_idx));
          }
        });
      }
    });
    return moves;
  }

  static getNextData(data, move) {
    if (data.xIsNext === undefined) {
      throw Error("Data xIsNext is undefined");
    }

    let squares = data.squares.map((x) => x.slice());

    if (!move || squares[move.outer_idx][move.inner_idx]) {
      console.log("hello");
      throw Error("field already taken");
    }
    if (!data.activeFields[move.outer_idx]) {
      throw Error("field inactive");
    }

    squares[move.outer_idx][move.inner_idx] = data.xIsNext ? "X" : "O";
    const localWinners = squares.map((x) => Field.calc3x3(x));
    const winner = Field.calc3x3(localWinners);
    let activeFields = data.activeFields.slice();
    if (localWinners[move.inner_idx]) {
      localWinners.forEach((x, i) => (activeFields[i] = x ? false : true));
    } else {
      activeFields = activeFields.map((x, i) => i === move.inner_idx);
    }

    if (winner) {
      activeFields = Array(9).fill(false);
    }

    return {
      winner: winner,
      squares: squares,
      localWinners: localWinners,
      activeFields: activeFields,
      xIsNext: !data.xIsNext,
    };
  }

  static getMove = (i, o) => {
    return { inner_idx: i, outer_idx: o };
  };

  static calc3x3 = (field) => {
    field = field.map((x) => (x ? x : " "));
    var matches = ["XXX", "OOO"];

    var winCombinations = [
      field[0] + field[1] + field[2], // 1st line
      field[3] + field[4] + field[5], // 2nd line
      field[6] + field[7] + field[8], // 3rd line
      field[0] + field[3] + field[6], // 1st column
      field[1] + field[4] + field[7], // 2nd column
      field[2] + field[5] + field[8], // 3rd column
      field[0] + field[4] + field[8], // Primary diagonal
      field[2] + field[4] + field[6], // Secondary diagonal
    ];

    // Loop through all the rows looking for a match
    for (var i = 0; i < winCombinations.length; i++) {
      if (
        winCombinations[i] === matches[0] ||
        winCombinations[i] === matches[1]
      ) {
        return winCombinations[i].charAt(0);
      }
    }
    return null;
  };

  static calcWinner = (squares) => {
    return Field.calc3x3(squares.map((x) => Field.calc3x3(x)));
  };

  static dataIsOver(data) {
    return Field.getMoves(data).length === 0;
  }

  static propagate(tree) {
    let data = tree.data;
    if (tree.hasChildren()) {
      throw Error("Tree shouldn't have children");
    } else {
      let winner = Field.calc3x3(data.localWinners);
      while (!Field.dataIsOver(data)) {
        data = Field.getNextData(data, getRandomMove(data));
        winner = data.winner;
      }
      if (winner) {
        return winner === (tree.data.xIsNext ? "O" : "X")
          ? Results.VICTORY
          : Results.DEFEAT;
      } else {
        return Results.DRAW;
      }
    }
  }
}

export const Results = {
  VICTORY: 1,
  DEFEAT: -1,
  DRAW: 0,
};
