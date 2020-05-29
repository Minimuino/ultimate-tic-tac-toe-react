import React from "react";
import CountDown from "./CountDown.js";
import Field from "./util/Field";

export default function GameSidebar(props) {
  return (
    <div className="game-info">
      <div id="status">{setStatus(props.state)}</div>
      {props.clock && getClock(props.timeOverCallback, props.time, props.state)}
    </div>
  );
}

function getClock(timeOverCallback, time, state) {
  const timerXPaused = !state.xIsNext || Boolean(state.winner);
  const timerOPaused = state.xIsNext || Boolean(state.winner);
  return (
    <div>
      [TIME] X:{" "}
      <CountDown
        key={1}
        player="X"
        seconds={time * 60}
        isPaused={timerXPaused}
        timeOverCallback={timeOverCallback}
      />
      , O:{" "}
      <CountDown
        key={2}
        player="O"
        seconds={time * 60}
        isPaused={timerOPaused}
        timeOverCallback={timeOverCallback}
      />
    </div>
  );
}

function setStatus(state) {
  let status;
  if (state.winner) {
    status = state.winner + " wins!";
    const lastOuterMove = {
      row: state.lastMoveLocation.outerRow,
      col: state.lastMoveLocation.outerCol,
    };
    if (Field.calculateWinner(state.localWinners, lastOuterMove) === null) {
      status = "Time over! " + status;
    }
  } else {
    if (state.localWinners.indexOf(null) === -1) {
      status = "Draw! Everybody wins!! :D";
      console.log(state);
    } else {
      status = "Next player: " + (state.xIsNext ? "X" : "O");
    }
  }
  return status;
}
