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
            matchID: 0
        };

        this.game = <Game key={this.state.matchID} size={this.state.boardSize}/>;
        this.newGame = this.newGame.bind(this);
    }

    newGame(size)
    {
        // console.log('New size is ' + size);
        this.setState((prevState, props) => ({
            boardSize: size,
            matchID: prevState.matchID+1
        }));
    }

    render()
    {
        return (
            <div className="game-container">
                <SettingsForm defaultValue={this.state.boardSize} submitCallback={this.newGame} /><br/>
                <Game key={this.state.matchID} size={this.state.boardSize} renderInfo={true} />
            </div>
        );
    }
}
