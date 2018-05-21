import React from 'react';
import Board from './Board.js';
import CountDown from './CountDown.js';
import generateGridNxN from '../util/GameUtil.js';

export default class Game extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            squares: Array(this.props.size * this.props.size).fill(null),
            lastMoveLocation: {row: null, col: null},
            xIsNext: true,
            winner: null,
            winnerLine: null
        };

        this.timeOver = this.timeOver.bind(this);
        this.renderBoard = this.renderBoard.bind(this);
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
        const squares = this.state.squares.slice();
        if (this.state.winner || squares[i])
        {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const lastMoveLocation = {row: Math.floor(i / size), col: i % size}
        const winnerLine = this.calculateWinner(squares, lastMoveLocation);
        const winner = winnerLine ? squares[winnerLine[0]] : null;
        this.setState((prevState, props) => ({
            squares: squares,
            lastMoveLocation: lastMoveLocation,
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

    renderBoard(i)
    {
        return (
            <Board key={i}
                size={this.props.size}
                squares={this.state.squares}
                winnerLine={this.state.winnerLine}
                onClick={(p) => this.handleClick(p)}
            />
        );
    }

    render()
    {
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
            if (this.state.squares.indexOf(null) === -1)
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
        const grid = generateGridNxN('game', this.props.size, this.renderBoard);
        return (
            <div className="game-container">
                {grid}
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
                    </div>
                }
            </div>
        );
    }
}