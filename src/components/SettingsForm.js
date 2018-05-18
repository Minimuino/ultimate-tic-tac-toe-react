import React from 'react';

export default class SettingsForm extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            value: this.props.defaultValue
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event)
    {
        this.setState({value: event.target.value});
    }

    handleSubmit(event)
    {
        this.props.submitCallback(this.state.value);
        event.preventDefault();
    }

    render()
    {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Board size <input type="number" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="New game" />
            </form>
        );
    }
}
