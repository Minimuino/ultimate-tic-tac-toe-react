import React, { Component } from "react";

import Board from "./Board.js";
import generateGridNxN, { isFieldActive } from "../util/GameUtil.js";
import { defaultPlayers } from "./PlayerSettings";

import { wrap } from "comlink";

import GameSidebar from "./GameSideBar";

import PlayerSettings from "./PlayerSettings";
import * as serviceWorker from "../serviceWorker";

/*
import AI from "./AI.js";
import - from "./workerSetup";*/

export default class Game extends Component {
  state = {
    squares: Array(3 * 3).fill(
      // Outer squares
      Array(3 * 3).fill(null)
    ), // Inner squares
    localWinners: Array(3 * 3).fill(null),
    lastMoveLocation: {
      row: null,
      col: null,
      outerRow: null,
      outerCol: null,
    },
    xIsNext: true,
    winner: null,
    size: 3,
    players: defaultPlayers,
  };

  getAIMove(t) {
    const worker = new Worker("./webworker", {
      name: "webworker",
      type: "module",
    });
    const workerApi = wrap(worker);
    workerApi.getAIMove(t.state).then((move) => {
      console.log(move);
      t.handleClick(move.inner_idx, move.outer_idx);
    });
  }

  getPlayer = () => {
    return this.players;
  };
  setPlayer = (players) => {
    this.setState({ players: { ...players } });
  };

  isFieldActiveWrapper(idx) {
    if (this.state.winner) return false;

    return isFieldActive(
      idx,
      this.state.lastMoveLocation,
      this.state.localWinners
    );
  }

  handleClick = (inner_idx, outer_idx) => {
    const size = 3;
    var outerSquares = this.state.squares.slice();
    var squares = this.state.squares[outer_idx].slice();
    var localWinners = this.state.localWinners.slice();
    if (
      this.state.winner ||
      !this.isFieldActiveWrapper(outer_idx) ||
      squares[inner_idx]
    ) {
      throw new Error("Handleclick");
    }
    squares[inner_idx] = this.state.xIsNext ? "X" : "O";
    outerSquares[outer_idx] = squares;
    const lastMoveLocation = {
      row: Math.floor(inner_idx / size),
      col: inner_idx % size,
      outerRow: Math.floor(outer_idx / size),
      outerCol: outer_idx % size,
    };
    const newWinnerLine = this.calculateWinner(squares, lastMoveLocation);
    localWinners[outer_idx] = newWinnerLine && squares[newWinnerLine[0]];
    const globalWinnerLine = this.calculateWinner(localWinners, {
      row: lastMoveLocation.outerRow,
      col: lastMoveLocation.outerCol,
    });
    const winner = globalWinnerLine ? localWinners[globalWinnerLine[0]] : null;
    this.setState((prevState, props) => ({
      squares: outerSquares,
      localWinners: localWinners,
      lastMoveLocation: lastMoveLocation,
      xIsNext: !this.state.xIsNext,
      winner: winner,
    }));
  };

  calculateWinner(squares, lastMoveLocation) {
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

  renderBoard = (i) => {
    return (
      <Board
        key={i}
        size={3}
        squares={this.state.squares[i]}
        winner={this.state.localWinners[i]}
        clickable={this.isFieldActiveWrapper(i)}
        onClick={(p) => this.handleClick(p, i)}
      />
    );
  };

  render() {
    const { state } = this;
    if (state.xIsNext && state.players.p1 === "ai") {
      this.getAIMove(this);
      console.log("message posted");
    } else if (!state.xIsNext && state.players.p2 === "ai") {
      this.getAIMove(this);
    }
    const GameGrid = generateGridNxN("game", 3, this.renderBoard);
    return (
      <div className="Game-Settings">
        <PlayerSettings callBackPlayer={this.setPlayer} />
        <div className="game-container">
          {GameGrid}
          {this.props.renderInfo && (
            <GameSidebar
              clock={this.props.clock}
              timeOver={this.timeOver}
              time={this.props.time}
              calculateWinner={this.calculateWinner}
              state={state}
            />
          )}
        </div>
      </div>
    );
  }
  timeOver = (player) => {
    if (player === "X") {
      this.setState({ winner: "O" });
    } else {
      this.setState({ winner: "X" });
    }
  };
}
