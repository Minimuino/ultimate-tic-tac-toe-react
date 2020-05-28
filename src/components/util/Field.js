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
            moves.push({ inner_idx: innerIndex, outer_idx: outerIndex });
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

  static getNextData(data, move, x) {}

  static isOver(tree) {}

  static propagate(tree) {}
}

export const Results = {
  VICTORY: 1,
  DEFEAT: -1,
  DRAW: 0,
};
