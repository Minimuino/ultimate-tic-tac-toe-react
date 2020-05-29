export default class Field {
  static getMoves(data) {
    let moves = [];
    data.localWinners.forEach((field, outerIndex) => {
      if (
        field === null &&
        Field.isFieldActive(
          outerIndex,
          data.lastMoveLocation,
          data.localWinners
        )
      ) {
        data.squares[outerIndex].forEach((x, innerIndex) => {
          if (x === null) {
            moves.push(Field.getMove(innerIndex, outerIndex));
          }
        });
      }
    });
    return moves;
  }

  static isFieldActive(idx, lastMoveLocation, localWinners) {
    const lastRow = lastMoveLocation.row;
    const lastCol = lastMoveLocation.col;
    if (lastRow === null || lastCol === null) {
      return true;
    } else {
      const currentBoard = lastRow * 3 + lastCol;
      if (localWinners[currentBoard]) {
        return localWinners[idx] === null;
      } else {
        return idx === currentBoard;
      }
    }
  }

  static getNextData(data, move) {
    if (data.xIsNext === undefined) {
      throw Error("Data x is undefined");
    }
    let inner_idx = move.inner_idx;
    let outer_idx = move.outer_idx;

    var outerSquares = data.squares.slice();
    var squares = data.squares[outer_idx].slice();
    var localWinners = data.localWinners.slice();

    if (
      !Field.isFieldActive(outer_idx, data.lastMoveLocation, localWinners) ||
      squares[inner_idx]
    ) {
      throw Error("illegal Move");
    }

    squares[inner_idx] = data.xIsNext ? "X" : "O";
    outerSquares[outer_idx] = squares;

    const lastMoveLocation = Field.getlastMoveLocation(move);

    const newWinnerLine = Field.calculateWinner(squares, lastMoveLocation);
    localWinners[outer_idx] = newWinnerLine && squares[newWinnerLine[0]];

    const newData = {
      squares: outerSquares,
      localWinners: localWinners,
      lastMoveLocation: lastMoveLocation,
      xIsNext: !data.xIsNext,
    };
    return newData;
  }

  static getMove = (i, o) => {
    return { inner_idx: i, outer_idx: o };
  };

  static getlastMoveLocation = (move) => {
    const lastMoveLocation = {
      row: Math.floor(move.inner_idx / 3),
      col: move.inner_idx % 3,
      outerRow: Math.floor(move.outer_idx / 3),
      outerCol: move.outer_idx % 3,
    };
    return lastMoveLocation;
  };

  static getWinner = (localWinners, lastMoveLocation) => {
    const globalWinnerLine = Field.calculateWinner(localWinners, {
      row: lastMoveLocation.outerRow,
      col: lastMoveLocation.outerCol,
    });
    return globalWinnerLine ? localWinners[globalWinnerLine[0]] : null;
  };

  static calculateWinner(squares, lastMoveLocation) {
    if (
      !lastMoveLocation ||
      lastMoveLocation.row === null ||
      lastMoveLocation.col === null
    )
      return null;

    const size = Math.sqrt(squares.length);
    const x = lastMoveLocation.row;
    const y = lastMoveLocation.col;
    const lastPlayer = squares[x * size + y];
    if (lastPlayer === null) return null;

    // Generate possible winner lines for last move
    var lines = { row: [], col: [], diag: [], antidiag: [] };
    // Row
    for (let i = 0; i < size; i++) {
      lines.row.push(x * size + i);
    }
    // Col
    for (let i = 0; i < size; i++) {
      lines.col.push(i * size + y);
    }
    // Diagonal
    if (x === y) {
      for (let i = 0; i < size; i++) {
        lines.diag.push(i * size + i);
      }
    }
    // Anti-diagonal
    if (x + y === size - 1) {
      for (let i = 0; i < size; i++) {
        lines.antidiag.push(i * size + size - 1 - i);
      }
    }

    // Chech values on each candidate line
    for (let prop in lines) {
      const line = lines[prop];
      if (line.length !== size) continue;
      const result = line.reduce(
        (acc, index) => acc && squares[index] === lastPlayer,
        true
      );
      if (result) {
        return line;
      }
    }
    return null;
  }

  static isOver(tree) {}

  static propagate(tree) {}
}

export const Results = {
  VICTORY: 1,
  DEFEAT: -1,
  DRAW: 0,
};
