import React from "react";
import { Dropdown, Input, Checkbox, Button } from 'semantic-ui-react'


export const dropdownOptions = [
  { key: "h", value: "human", text: "human" },
  { key: "a", value: "ai", text: "ai" }]


export default class SettingsForm extends React.Component {
  constructor(props) {
    super(props);
    let defaults = this.props.defaultValues
    this.state = {
      boardSize: 3,
      clock: defaults.clock,
      time: defaults.time,
      players: {
        one: defaults.players.p1,
        p1: defaults.players.p2,
        aiP1T: defaults.players.aiP1T,
        aiP2T: defaults.players.aiP2T,
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.handleTarget(target)
  }

  handleTarget(target) {
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "clock") {
      console.log("Clock: " + target.value)
    }
    this.setState({
      [name]: value,
    });
  }

  handlePlayers = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    let copy = { ...this.state.players }
    copy[name] = value
    this.setState({ players: copy })

  }

  handleSubmit(event) {
    this.props.submitCallback(
      this.state.clock,
      this.state.time,
      this.state.players
    );
    event.preventDefault();
  }

  render() {
    return (
      <form >
        <Button size="mini" onClick={this.handleSubmit} > new Game</Button>
        <label className="settings-label">
          <Dropdown
            inline
            options={dropdownOptions}
            name="p1"
            onChange={(a, b) => {
              let copy = { ...this.state.players }
              copy.p1 = b.value
              this.setState({ players: copy });
            }}
            defaultValue={this.state.players.p1}
          /> vs. <Dropdown
            inline
            name="p2"
            options={dropdownOptions}
            defaultValue={this.state.players.p2}
            onChange={(a, b) => {
              let copy = { ...this.state.players }
              copy.p2 = b.value
              this.setState({ players: copy });
            }}
          />
        </label>

        <label className="settings-label">
          <Checkbox
            label="Clock"
            name="clock"
            type="checkbox"
            onChange={(a, b) => this.handleTarget(b)}
          />
        </label>
        <br />
        {(this.state.players.p1 === "ai") && (

          <label className="settings-label">
            <Input
              label="AI player1 time (s)"
              size='mini'
              name="aiP1T"
              type="number"
              min="0.001"
              max="9"

              value={this.state.players.aiP1T}
              onChange={this.handlePlayers}
            />
          </label>
        )}
        {(this.state.players.p2 === "ai") && (
          <label className="settings-label">

            <Input
              label="AI player2 time (s)"
              size='mini'
              name="aiP2T"
              min="0.001"
              type="number"
              max="9"
              value={this.state.players.aiP2T}
              onChange={this.handlePlayers}
            />
          </label>
        )}

        {
          this.state.clock && (
            <label className="settings-label">
              <Input
                label="Time (min)"
                size="mini"
                name="time"
                type="number"
                max="100"
                min="1"
                value={this.state.time}
                onChange={this.handleChange}
              />
            </label>
          )
        }
      </form >
    );
  }
}
