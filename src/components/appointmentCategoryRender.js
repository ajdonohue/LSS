import React, { Component } from "react";
import "../css/appointmentCategoryRender.css";
import Calendar from 'react-calendar';

//
// Props -
//
// id: id of appointment tutor
// firstName, lastName: name of appointment tutor
// bookingScene: function to change scene of parent component on btn click
//

class AppointmentCategoryRender extends Component {
  render() {
    return (
      <div className="container mainContainer">
        <div className="row">
          <div className="col">
            {this.props.firstName} {this.props.lastName}
          </div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col">
            <button
              className="btn bookBtn"
              onClick={() => this.props.bookingScene(this.props.tutor)}
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AppointmentCategoryRender;
