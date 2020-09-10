import React, { Component } from "react";
import "../css/appointmentBookingRow.css";

//
// Props -
//
// timeSlot: time value of the appointment slot in 24hr
// rowClick: function in parent to push value of row
// into selectedTimes state
// selectedTimes: array from parent of all currently selected times
//

class AppointmentBookingRow extends Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }

  componentDidMount = () => {};

  componentDidUpdate = (prevProps) => {
    if (this.props.selectedTimes !== prevProps.selectedTimes) {
      let isClicked = this.props.selectedTimes.includes(this.props.timeSlot);
      if (isClicked) {
        this.setState({ clicked: true });
      } else {
        this.setState({ clicked: false });
      }
    }
  };

  handleRowAndClass = () => {
    this.props.rowClick(this.props.timeSlot);
    this.setState({ clicked: !this.state.clicked });
  };

  convertAppointmentTime = (time) => {
    if (time === 9) return "9:00:00 AM";
    else if (time === 9.5) return "9:30 AM";
    else if (time === 10) return "10:00 AM";
    else if (time === 10.5) return "10:30 AM";
    else if (time === 11) return "11:00 AM";
    else if (time === 11.5) return "11:30 AM";
    else if (time === 12) return "12:00 PM";
    else if (time === 12.5) return "12:30 PM";
    else if (time === 13) return "1:00 PM";
    else if (time === 13.5) return "1:30 PM";
    else if (time === 14) return "2:00 PM";
    else if (time === 14.5) return "2:30 PM";
    else if (time === 15) return "3:00 PM";
    else if (time === 15.5) return "3:30 PM";
    else if (time === 16) return "4:00 PM";
    else if (time === 16.5) return "4:30 PM";
    else if (time === 17) return "5:00 PM";
  };

  render() {
    return (
      <div
        onClick={this.handleRowAndClass}
        className={this.state.clicked ? "row rowSelected" : "rowDefault"}
      >
        <div className="col">
          {this.convertAppointmentTime(this.props.timeSlot)} -{" "}
          {this.convertAppointmentTime(this.props.timeSlot + 0.5)}
        </div>
      </div>
    );
  }
}

export default AppointmentBookingRow;
