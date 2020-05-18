import React, { Component } from "react";
import { Dropdown, Input } from "semantic-ui-react";
import { players } from "./Game";

export const dropdownOptions = [
  { key: "h", value: "human", text: "human" },
  { key: "a", value: "ai", text: "ai" },
];

class GameSettings extends Component {
  state = {
    players: players, //TODO: change!
    callBackPlayer: this.props.callBackPlayer,
  };

  handlePlayers = (event) => {
    const target = event.target;
    this.handlePlayerTarget(target);
  };

  handlePlayerTarget = (name, target) => {
    const value = target.type === "checkbox" ? target.checked : target.value;
    let copy = { ...this.state.players };
    copy[name] = value;
    this.setState({ players: copy });
    if (this.state.callBackPlayer) {
      this.state.callBackPlayer(copy);
    }
  };
  render() {
    return (
      <div>
        {" "}
        <Dropdown
          inline
          options={dropdownOptions}
          name="p1"
          onChange={(a, b) => this.handlePlayerTarget("p1", b)}
          defaultValue={this.state.players.p1}
        />{" "}
        vs.{" "}
        <Dropdown
          inline
          name="p2"
          options={dropdownOptions}
          defaultValue={this.state.players.p2}
          onChange={(a, b) => this.handlePlayerTarget("p2", b)}
        />
        <br />
        {this.state.players.p1 === "ai" && (
          <label className="settings-label">
            <Input
              label="AI player1 time (s)"
              size="mini"
              name="aiP1T"
              type="number"
              min="0.001"
              max="9"
              value={this.state.players.aiP1T}
              onChange={this.handlePlayers}
            />
          </label>
        )}
        {this.state.players.p2 === "ai" && (
          <label className="settings-label">
            <Input
              label="AI player2 time (s)"
              size="mini"
              name="aiP2T"
              min="0.001"
              type="number"
              max="9"
              value={this.state.players.aiP2T}
              onChange={this.handlePlayers}
            />
          </label>
        )}
      </div>
    );
  }
}

export default GameSettings;
