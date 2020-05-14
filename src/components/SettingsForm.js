import React from "react";

export default class SettingsForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      boardSize: this.props.defaultValues.boardSize,
      clock: this.props.defaultValues.clock,
      time: this.props.defaultValues.time,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    this.props.submitCallback(
      this.state.boardSize,
      this.state.clock,
      this.state.time
    );
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value="New game" />
        <label className="settings-label">
          Board size{" "}
          <input
            name="boardSize"
            type="number"
            min="3"
            max="3"
            value={this.state.boardSize}
            onChange={this.handleChange}
          />
        </label>
        <label className="settings-label">
          Clock{" "}
          <input
            name="clock"
            type="checkbox"
            checked={this.state.clock}
            onChange={this.handleChange}
          />
        </label>
        {this.state.clock && (
          <label className="settings-label">
            Time (min){" "}
            <input
              name="time"
              type="number"
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
