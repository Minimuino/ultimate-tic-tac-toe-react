import React from 'react';
import SettingsForm from './components/SettingsForm.js';
import Game from './components/Game.js';

export default class App extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            boardSize: 3,
            clock: true,
            time: 10,
            matchID: 0
        };

        this.newGame = this.newGame.bind(this);
    }

    newGame(size, clock, time)
    {
        // console.log('New size is ' + size);
        this.setState((prevState, props) => ({
            boardSize: size,
            clock: clock,
            time: time,
            matchID: prevState.matchID+1
        }));
    }

    render()
    {
        return (
            <div className="game-container">
                <SettingsForm defaultValues={this.state} submitCallback={this.newGame} /><br/>
                <Game key={this.state.matchID}
                    size={this.state.boardSize}
                    clock={this.state.clock}
                    time={this.state.time}
                    renderInfo={true} />
            </div>
        );
    }
}
