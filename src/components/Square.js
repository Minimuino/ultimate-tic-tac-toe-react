import React from 'react';

export default function Square(props)
{
    var style = {};
    if (props.value)
    {
        style.color = props.value === 'X' ? '#fc7341' : '#2db2e2';
    }
    if (props.winner)
    {
        if (props.winner === 'X')
        {
            style.background = '#ffccb5';
        }
        else
        {
            style.background = '#dbf5ff';
        }
    }
    if (props.clickable)
    {
        style.background = '#e2ffec';
    }
    return (
        <button className="square" style={style} onClick={props.onClick}>
            {props.value}
        </button>
    );
}