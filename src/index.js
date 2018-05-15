import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props)
{
    var style = {};
    if (props.value)
    {
        style.color = props.value === 'X' ? '#fc7341' : '#2db2e2';
    }
    if (props.winner)
    {
        style.background = '#e5ffd6';
    }
    return (
        <button className="square" style={style} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component
{
    renderSquare(i)
    {
        var winnerSquare = false;
        if (this.props.winnerLine && this.props.winnerLine.indexOf(i) >= 0)
        {
            winnerSquare = true;
        }
        return (
            <Square
                value={this.props.squares[i]}
                winner={winnerSquare}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render()
    {
        const rows = [
            <div className="board-row" key={0}>
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div>,
            <div className="board-row" key={1}>
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>,
            <div className="board-row" key={2}>
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
        ];
        // const size = [3, 3]; // This should be a prop
        // var rows = [];
        // for (let i = 0; i < size[0]; i++)
        // {
        //     let cols = [];
        //     for (let j = 0; j < size[1]; j++)
        //     {

        //     }
        //     rows.push(
        //         <div className="board-row" key={i}>{cols}</div>
        //     );
        // }
        return (
            <div>{rows}</div>
        );
    }
}

class Game extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
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
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i])
        {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        const lastMoveLocation = {row: Math.floor(i / 3), col: i % 3}
        this.setState({
            history: history.concat([{squares: squares, lastMoveLocation: lastMoveLocation}]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
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
                <li key={move}>
                    <button style={style} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        const winnerLine = calculateWinner(current.squares);
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
                        squares={current.squares}
                        winnerLine={winnerLine}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares)
{
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let line of lines)
    {
        const [a, b, c] = line;
        if (squares[a] && (squares[a] === squares[b]) && (squares[b] === squares[c]))
        {
            return line;
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
