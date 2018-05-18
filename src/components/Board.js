import React from 'react';
import Square from './Square.js';

export default class Board extends React.Component
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