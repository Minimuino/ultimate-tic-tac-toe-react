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
            <Square key={i}
                value={this.props.squares[i]}
                winner={winnerSquare}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render()
    {
        const size = this.props.size;
        var rows = [];
        for (let i = 0; i < size; i++)
        {
            let cols = [];
            for (let j = 0; j < size; j++)
            {
                cols.push(this.renderSquare(i*size + j));
            }
            rows.push(
                <div className="board-row" key={i}>{cols}</div>
            );
        }
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
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves.reverse()}</ol>
                </div>
            </div>
        );
    }
}

class SettingsForm extends React.Component
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

class GameContainer extends React.Component
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
                <Game key={this.state.matchID} size={this.state.boardSize}/>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <GameContainer/>,
    document.getElementById('root')
);
