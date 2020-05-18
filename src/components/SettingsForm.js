import React from "react";
import { Input, Checkbox, Button } from "semantic-ui-react";

export default class SettingsForm extends React.Component {
  constructor(props) {
    super(props);
    let defaults = this.props.defaultValues;
    this.state = {
      boardSize: 3,
      clock: defaults.clock,
      time: defaults.time,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    this.handleTarget(target);
  }

  handleTarget(target) {
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "clock") {
      console.log("Clock: " + target.value);
    }
    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    this.props.submitCallback(this.state.clock, this.state.time);
    event.preventDefault();
  }

  render() {
    return (
      <form>
        <Button size="mini" onClick={this.handleSubmit}>
          {" "}
          new Game
        </Button>
        <label className="settings-label">
          <Checkbox
            label="Clock"
            name="clock"
            type="checkbox"
            onChange={(a, b) => this.handleTarget(b)}
          />
        </label>
        <br />

        {this.state.clock && (
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
        )}
      </form>
    );
  }
}
