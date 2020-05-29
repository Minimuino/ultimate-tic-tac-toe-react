import React, { Component } from "react";

import Board from "./Board.js";
import generateGridNxN from "./util/GameUtil.js";
import Field from "./util/Field";
import { defaultPlayers } from "./PlayerSettings";

import { wrap } from "comlink";

import GameSidebar from "./GameSideBar";

import PlayerSettings from "./PlayerSettings";

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

  workerApi = undefined;

  getAIMove = (t, type) => {
    this.getWorker();
    const doMove = (move) => {
      if (move) {
        t.handleClick(move);
      } else {
        throw Error("move is undefined: " + move);
      }
    };
    if (type === "rAI") {
      this.workerApi.getRandomMove(t.state).then((move) => {
        doMove(move);
      });
    } else if (type === "AI") {
      this.workerApi.getMonteCarloMove(t.state).then((move) => {
        doMove(move);
      });
    }
  };

  getWorker = () => {
    if (!this.workerApi) {
      const worker = new Worker("./webworker", {
        name: "webworker",
        type: "module",
      });
      this.workerApi = wrap(worker);
    }
  };

  getPlayer = () => {
    return this.players;
  };
  setPlayer = (players) => {
    this.setState({ players: { ...players } });
  };

  isFieldActiveWrapper(idx) {
    if (this.state.winner) return false;

    return Field.isFieldActive(
      idx,
      this.state.lastMoveLocation,
      this.state.localWinners
    );
  }

  handleClick = (move) => {
    if (this.state.winner) {
      return;
    }
    const nextData = Field.getNextData(this.state, move);

    const winner = Field.getWinner(
      nextData.localWinners,
      nextData.lastMoveLocation
    );

    this.setState((prevState, props) => ({
      winner: winner,
      ...nextData,
    }));
  };

  renderBoard = (i) => {
    return (
      <Board
        key={i}
        size={3}
        squares={this.state.squares[i]}
        winner={this.state.localWinners[i]}
        clickable={this.isFieldActiveWrapper(i)}
        onClick={(p) => this.handleClick(Field.getMove(p, i))}
      />
    );
  };

  render() {
    this.handleAI();
    const { state } = this;
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
              state={state}
            />
          )}
        </div>
      </div>
    );
  }

  handleAI = () => {
    const { state } = this;
    if (!state.winner && !(state.localWinners.indexOf(null) === -1)) {
      if (state.xIsNext && state.players.p1 !== "human") {
        this.getAIMove(this, state.players.p1);
      } else if (!state.xIsNext && state.players.p2 !== "human") {
        this.getAIMove(this, state.players.p2);
      }
    }
  };

  timeOver = (player) => {
    if (player === "X") {
      this.setState({ winner: "O" });
    } else {
      this.setState({ winner: "X" });
    }
  };
}
