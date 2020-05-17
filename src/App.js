import React from 'react';
import SettingsForm from './components/SettingsForm.js';
import Game from './components/Game.js';
export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clock: false,
            time: 10,
            matchID: 0,
            players: { p1: "human", p2: "human", aiP1T: 0.1, aiP2T: 0.1 },
        };

        this.newGame = this.newGame.bind(this);
    }

    newGame(clock, time, players) {
        // console.log('New size is ' + size);
        this.setState((prevState, props) => ({
            clock: clock,
            time: time,
            matchID: prevState.matchID + 1,
            players: players
        }));
    }

    render() {
        return (
            <div className="app">
                <div className="container mt-2" >
                    <div className="row justify-content-center">
                        <SettingsForm defaultValues={this.state} submitCallback={this.newGame} /><br />
                    </div>
                    <div className="row justify-content-center">

                        <Game key={this.state.matchID}
                            size={3}
                            clock={this.state.clock}
                            time={this.state.time}
                            renderInfo={true}
                            player={this.state.player}
                        />
                    </div>

                </div>
            </div >
        );
    }
}
