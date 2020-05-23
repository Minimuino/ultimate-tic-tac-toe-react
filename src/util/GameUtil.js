import React from "react";

/*
 * Generates a grid of NxN elements. Expects 3 parameters:
 *
 ** className: A class-name for the CSS stylesheet. The global name of the
	grid will be equal to the provided className; the name of each row
	will be equal to className + '-row'.
 ** size: The grid's size.
 ** generatorFunction: Custom function to create each element. This function
    must take an integer as unique parameter and return a valid React element.
 */
export default function generateGridNxN(className, size, generatorFunction) {
  var rows = [];
  for (let i = 0; i < size; i++) {
    let cols = [];
    for (let j = 0; j < size; j++) {
      cols.push(generatorFunction(i * size + j));
    }
    rows.push(
      <div className={className + "-row"} key={i}>
        {cols}
      </div>
    );
  }
  return <div className={className}>{rows}</div>;
}

export function getMoves(data) {
  let moves = [];
  data.localWinners.forEach((field, outerIndex) => {
    if (
      field === null &&
      isFieldActive(outerIndex, data.lastMoveLocation, data.localWinners)
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

export function isFieldActive(idx, lastMoveLocation, localWinners) {
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

// export default function calculateWinner(board, lastMoveLocation, checkFunction)
