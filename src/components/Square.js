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
        style.background = '#e5ffd6';
    }
    return (
        <button className="square" style={style} onClick={props.onClick}>
            {props.value}
        </button>
    );
}