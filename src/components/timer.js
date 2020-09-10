import React, { Component } from 'react';

export class Countdown extends Component {
    
    //props
    //
    //time: time of the appt - the current time divided by 1000, gets us the time in seconds until the appt

    constructor(props){
        super(props);
        //counter: amount of seconds until the appt
        this.state={counter:this.props.time};
        //time: an object representing the time until the appt in a HH/MM/SS format
        this.time = {}
        this.started = null
    }

    //This function takes an input in seconds, and converts it to an object in a HH/MM/SS format
    secondsToTime(secs){
        let hours = Math.floor(secs / (60 * 60));

        let divisor_for_minutes = secs % (60 * 60);
        let minutes = Math.floor(divisor_for_minutes / 60);

        let divisor_for_seconds = divisor_for_minutes % 60;
        let seconds = Math.ceil(divisor_for_seconds);

        let obj = {
        "h": hours,
        "m": minutes,
        "s": seconds
        };
        return obj;
    }

    //function for when appt starts
    //gets difference between the started time, which is established on the first trigger,
    //and the end time, which is established on the second trigger. Additional functionality
    //could, and should, be implemented, such as returning duration and using the result to
    //store the appt duration in the db
    StartAppt(s){
        if(!s){
            this.started = new Date()
        } else {
            let duration = this.secondsToTime((new Date().getTime() - this.started.getTime()) / 1000)
            console.log("HOUR: " + duration.h + " MIN: " + duration.m + " SEC: " + duration.s)
        }
    }

    render(){

        //Timeout is set here, refreshing and updating the component every second
        var x = this;
        var { counter } = this.state;
        setTimeout(function() {
        if (counter > 0) {
            x.setState({ counter: counter - 1 });
        }
        }, 1000);
        this.time = this.secondsToTime(this.state.counter)
        //This can be updated to just show time remaining in minutes, hours, etc
        return(
            <ol>
                Hours: {this.time.h}<br></br>
                Minutes: {this.time.m}<br></br>
                Seconds: {this.time.s}<br></br><br></br>

                Click to start appointment: <button onClick={() => this.StartAppt(this.started)}>Start</button>
            </ol>
        )
    }
}