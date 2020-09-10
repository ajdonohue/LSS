import React, { Component } from "react";
import "../css/appointmentTutorList.css";

//
// Props -
//
// appointments: booked appointment List
//

class AppointmentTutorList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appointments: this.props.appointments,
    };
  }

  componentDidMount = () => {
    console.log(this.props.appointments);
  };

  componentDidUpdate = (prevProps) => {
    if (this.props.appointments !== prevProps.appointments) {
      this.setState({ appointments: this.props.appointments });
    }
  };

  isOdd = (n) => {
    if (n % 2 === 0) return true;
  };

  renderAppointments = () => {
    let counter = 0;
    if (this.state.appointments) {
      return this.state.appointments.map((e) => (
        <div className="col" key={e.id}>
          <div
            className={
              this.isOdd(counter++) ? "trueQRow rounded " : "falseQRow rounded"
            }
            key={Math.random()}
          >
            <div className="row d-flex justify-content-center">
              Date: {e.date} | Student ID: {e.studentID}
            </div>
            <div className="row d-flex justify-content-center">
              Start Time {e.startTime} | End Time: {e.endTime}
            </div>
          </div>
        </div>
      ));
    }
  };

  render() {
    return (
      <div className="row ">
        <div className="col">
          <div className="row d-flex justify-content-around">
            <h3 className="appointmentHead">Upcoming Appointmets</h3>
            <span>
              {this.state.btnState ? (
                <button
                  type="button"
                  className="getNextApp btn btn-default"
                  onClick={this.getActiveQ}
                >
                  Get Next Appointment
                </button>
              ) : (
                <button
                  type="button"
                  className="getNextApp btn btn-default"
                  onClick={this.getActiveQ}
                  disabled
                >
                  Get Next Appointment
                </button>
              )}
            </span>
          </div>
        </div>
        <div className="container">{this.renderAppointments()}</div>
      </div>
    );
  }
}

export default AppointmentTutorList;
