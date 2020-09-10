import React, { Component } from "react";

class HistoryRender extends Component {
  state = {};
  render() {
    return (
      <div className="card historyCard">
        <div className="card-header">
          <h3>Date:</h3> {this.props.date}
        </div>
        <div className="card-body">
          <div>
            <b>Program: </b>
            {this.props.pID}
          </div>
          <div>
            <b>Tutor: </b>
            {this.props.tutor}
          </div>
          <div>
            <b>Student ID:</b> {this.props.sID}
          </div>
          <div>
            <b>Appointment Start:</b> {this.props.aStart}
          </div>
          <div>
            <b>Appointment End:</b> {this.props.aEnd}
          </div>
          <div>
            <b>Time Queue'd: </b>
            {this.props.timeQD}
          </div>
        </div>
      </div>
    );
  }
}

export default HistoryRender;
