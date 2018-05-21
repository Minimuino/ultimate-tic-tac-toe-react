import React from 'react';

export default class CountDown extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {elapsed: 0};

        this.lastTick = null;
        this.tick = this.tick.bind(this);
    }

    // componentDidMount()
    // {
    //  this.timer = setInterval(this.tick, 1000);
    //  console.log('Mount timer ' + this.timer);
    // }

    componentWillUnmount()
    {
        clearInterval(this.timer);
    }

    tick()
    {
        this.setState((prevState, props) => {
            var now = new Date();
            const dt = now - this.lastTick;
            const elapsed = prevState.elapsed + dt;
            // Check if time is over
            const remaining = props.seconds - elapsed / 1000;
            if (remaining < 0.15)
            {
                props.timeOverCallback(props.player);
            }
            return {
                elapsed: elapsed
            };
        });
        this.lastTick = new Date();
    }

    pause()
    {
        clearInterval(this.timer);
        this.timer = null;
        this.lastTick = null;
    }

    resume()
    {
        this.timer = setInterval(this.tick, 1000);
        this.lastTick = new Date();
    }

    render()
    {
        const remaining = this.props.seconds - Math.floor(this.state.elapsed / 1000);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        if (this.props.isPaused)
        {
            // console.log('Pause!!');
            this.pause();
        }
        else if (!this.timer)
        {
            // console.log('Resume!!');
            this.resume();
        }

        return <p className="countdown">{("0" + minutes).slice(-2)}:{("0" + seconds).slice(-2)}</p>;
    }
}