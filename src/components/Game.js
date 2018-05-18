import React from 'react';
import Board from './Board.js';

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
            xIsNext: true
        };
    }

    jumpTo(step)
    {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    handleClick(i)
    {
        const size = this.props.size;
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (this.calculateWinner(squares, current.lastMoveLocation) || squares[i])
        {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const lastMoveLocation = {row: Math.floor(i / size), col: i % size}
        this.setState((prevState, props) => ({
            history: history.concat([{squares: squares, lastMoveLocation: lastMoveLocation}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
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
        const winnerLine = this.calculateWinner(current.squares, current.lastMoveLocation);
        if (winnerLine)
        {
            const winner = current.squares[winnerLine[0]];
            status = winner + ' wins!';
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

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        size={this.props.size}
                        squares={current.squares}
                        winnerLine={winnerLine}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                {this.props.renderInfo &&
                    <div className="game-info">
                        <div>{status}</div>
                        <ol>{moves.reverse()}</ol>
                    </div>
                }
            </div>
        );
    }
}