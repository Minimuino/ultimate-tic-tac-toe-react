import React from 'react';
import Square from './Square.js';
import generateGridNxN from '../util/GameUtil.js';

export default class Board extends React.Component
{
    constructor(props)
    {
        super(props);
        this.renderSquare = this.renderSquare.bind(this);
    }

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
        return generateGridNxN(
            'board',
            this.props.size,
            this.renderSquare
        );
    }
}