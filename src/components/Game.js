import React from 'react';
import Board from './Board.js';
import CountDown from './CountDown.js';

export default class Game extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            history: [{
                squares: Array(this.props.size * this.props.size).fill(null),
                lastMoveLocation: {row: null, col: null}
            }],
            stepNumber: 0,
            xIsNext: true,
            winner: null,
            winnerLine: null
        };

        this.timeOver = this.timeOver.bind(this);
    }

    jumpTo(step)
    {
        var winner;
        var winnerLine;
        if (step !== this.state.history.length-1)
        {
            winner = null;
            winnerLine = null;
        }
        else
        {
            const history = this.state.history;
            const current = history[step];
            winnerLine = this.calculateWinner(current.squares, current.lastMoveLocation);
            winner = current.squares[winnerLine[0]];
        }
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            winner: winner,
            winnerLine: winnerLine
        });
    }

    timeOver(player)
    {
        // console.log('Time over!!' + player + ' loses');
        if (player === 'X')
        {
            this.setState({winner: 'O'});
        }
        else
        {
            this.setState({winner: 'X'});
        }
    }

    handleClick(i)
    {
        const size = this.props.size;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (this.state.winner || squares[i])
        {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const lastMoveLocation = {row: Math.floor(i / size), col: i % size}
        const winnerLine = this.calculateWinner(squares, lastMoveLocation);
        const winner = winnerLine ? squares[winnerLine[0]] : null;
        this.setState((prevState, props) => ({
            history: history.concat([{squares: squares, lastMoveLocation: lastMoveLocation}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            winner: winner,
            winnerLine: winnerLine
        }));
    }

    calculateWinner(squares, lastMoveLocation)
    {
        if (!lastMoveLocation || lastMoveLocation.row===null || lastMoveLocation.col===null)
            return null;

        const size = Math.sqrt(squares.length);
        const x = lastMoveLocation.row;
        const y = lastMoveLocation.col;
        const lastPlayer = squares[x*size + y];

        // Generate possible winner lines for last move
        var lines = {row: [], col: [], diag: [], antidiag: []};
        // Row
        for (let i = 0; i < size; i++)
        {
            lines.row.push(x*size + i);
        }
        // Col
        for (let i = 0; i < size; i++)
        {
            lines.col.push(i*size + y);
        }
        // Diagonal
        if (x === y)
        {
            for (let i = 0; i < size; i++)
            {
                lines.diag.push(i*size + i);
            }
        }
        // Anti-diagonal
        if (x + y === size - 1)
        {
            for (let i = 0; i < size; i++)
            {
                lines.antidiag.push(i*size + size-1-i);
            }
        }

        // Chech values on each candidate line
        for (let prop in lines)
        {
            const line = lines[prop];
            if (line.length !== size)
                continue;
            const result = line.reduce((acc, index) => acc && (squares[index] === lastPlayer), true);
            if (result)
            {
                return line;
            }
        }
        return null;
    }

    render()
    {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const moves = history.map((step, move) => {
            let desc;
            if (move)
            {
                const location = history[move].lastMoveLocation.row + ', ' + history[move].lastMoveLocation.col;
                desc = 'Go to move #' + move + ' (' + location + ')';
            }
            else
            {
                desc = 'Go to game start';
            }
            const style = this.state.stepNumber === move ? {fontWeight: 'bold'} : {};
            return (
                <li key={move} value={move}>
                    <button style={style} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (this.state.winner)
        {
            status = this.state.winner + ' wins!';
            if (this.state.winnerLine === null)
            {
                status = 'Time over! ' + status;
            }
        }
        else
        {
            if (current.squares.indexOf(null) === -1)
            {
                status = 'Draw! Everybody wins!! :D';
            }
            else
            {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }

        const timerXPaused = !this.state.xIsNext || Boolean(this.state.winner);
        const timerOPaused = this.state.xIsNext || Boolean(this.state.winner);
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        size={this.props.size}
                        squares={current.squares}
                        winnerLine={this.state.winnerLine}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                {this.props.renderInfo &&
                    <div className="game-info">
                        <div>{status}</div>
                        {this.props.clock &&
                            <div>[TIME]
                                X: <CountDown key={1}
                                    player="X"
                                    seconds={this.props.time}
                                    isPaused={timerXPaused}
                                    timeOverCallback={this.timeOver} />
                                , O: <CountDown key={2}
                                    player="O"
                                    seconds={this.props.time}
                                    isPaused={timerOPaused}
                                    timeOverCallback={this.timeOver} />
                            </div>
                        }
                        <ol>{moves.reverse()}</ol>
                    </div>
                }
            </div>
        );
    }
}