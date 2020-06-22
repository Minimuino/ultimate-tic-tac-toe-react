import React, { Component } from "react";

import Board from "./Board.js";
import generateGridNxN from "./util/GameUtil.js";
import Field from "./util/Field";
import { humanVsHuman } from "./PlayerSettings";

import { wrap } from "comlink";

import GameSidebar from "./GameSideBar";

import PlayerSettings from "./PlayerSettings";

export const gamestartStats = {
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
};

export default class Game extends Component {
  state = {
    ...gamestartStats,
  };

  constructor(props) {
    super(props);
    if (props.players) {
      this.state.players = props.players;
    } else {
      this.state.players = humanVsHuman;
    }
  }

  workerApi = undefined;
  workers = [0];

  getAIMove = (t, type) => {
    this.removeWorkers();

    this.getWorker();
    const doMove = (move, w) => {
      if (this.noUpdateOccured(w)) {
        if (move) {
          t.handleClick(move);
        } else {
          throw Error("move is undefined: " + move);
        }
      }
    };
    let id = this.getIdWorkerId();
    if (type === "rAI") {
      this.workerApi.getRandomMove(t.state).then((move) => {
        doMove(move, id);
      });
    } else if (type === "AI") {
      let time = t.state.xIsNext
        ? this.state.players.aiP1T
        : this.state.players.aiP2T;
      time = time * 1000;
      this.workerApi.getMonteCarloMove(t.state, time).then((move) => {
        doMove(move, id);
      });
    }
  };

  getIdWorkerId = () => {
    let id = this.workers[0] + 1;
    this.workers.push(id);
    this.workers[0] = id + 1;
    return id;
  };

  noUpdateOccured = (id) => {
    return this.workers.indexOf(id) !== -1;
  };

  removeWorkers = () => {
    this.workers = [this.workers[0]];
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
    if (this.props.onPlayerChange) {
      this.props.onPlayerChange(players);
    }
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
        <PlayerSettings
          callBackPlayer={this.setPlayer}
          players={state.players}
        />
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
    if (Field.getMoves(state).length > 0) {
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
