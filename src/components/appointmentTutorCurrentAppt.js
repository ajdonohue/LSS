import React, { Component } from "react";
import PouchDB from "pouchdb";
import "../css/tutorActiveQ.css";

//
// Rendered By: appointmentDash
//
// Props -
// sortedAppointments: sorted array of upcoming appointments
//
//

// scenes - empty, readyToStart, timedOut
// appointmentStates - readyToStart, Started,  Extended, Ended

class AppointmentTutorCurrentAppt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nextAppointment: null,
      fullName: " ",
      minutes: 0,
      seconds: 0,
      interval: null,
      timeout: null,
      scene: "empty",
      appointmentState: null,
    };
  }

  componentDidMount = async () => {
    if (this.props.sortedAppointments)
      await this.setState({
        nextAppointment: this.props.sortedAppointments[0],
      });
    this.checkState();
  };

  componentDidUpdate = async (prevProps) => {
    if (this.props.sortedAppointments !== prevProps.sortedAppointments) {
      await this.setState({
        nextAppointment: this.props.sortedAppointments[0],
      });
      this.checkState();
      if (this.state.nextAppointment) this.getStudentName();
    }
  };

  checkState = () => {
    if (this.state.nextAppointment)
      this.setState({
        scene: "appointmentReady",
        appointmentState: "readyToStart",
      });
  };

  convertTimeStringTo24 = (time) => {
    let startColon = time.indexOf(":");
    let start24 = time.substr(time.length - 2);
    let startH, startM;

    if (startColon === 1) {
      startH = parseInt(time.charAt(0));
      if (start24 === "PM") {
        startH = startH + 12;
      }
    } else if (startColon === 2) {
      startH = parseInt(time.substr(0, 2));
      if (start24 === "PM") {
        if (startH !== 12) startH = startH + 12;
      }
    }

    startM = parseInt(time.substr(startColon + 1, startColon + 2));
    if (startM !== 0) startH += 0.5;
    return startH;
  };

  setAppointmentStatus = () => {
    if (this.state.appointmentState === "readyToStart") {
      return "Appointment is ready to start";
    } else if (this.state.appointmentState === "started") {
      return "Appointment is started";
    } else return "No appointment status";
  };

  renderTimeoutScene = () => {
    this.setState({ scene: "timedOut" });
    clearInterval(this.state.interval);
    if (this.state.timeout) clearTimeout(this.state.timeout);
  };

  startTimer = async () => {
    if (this.state.nextAppointment) {
      let start24 = this.convertTimeStringTo24(
        this.state.nextAppointment.startTime
      );
      let end24 = this.convertTimeStringTo24(
        this.state.nextAppointment.endTime
      );
      let apptLength = (end24 - start24) * 60;
      await this.setState({ minutes: apptLength, seconds: 0 });
    } else await this.setState({ minutes: 0, seconds: 0 });
    let t = this.state.minutes * 60000;
    let interval = setInterval(() => {
      if (this.state.seconds > 0) {
        this.setState({ seconds: this.state.seconds - 1 });
      }
      if (this.state.seconds === 0) {
        if (this.state.minutes === 0) {
          clearInterval(interval);
        } else {
          this.setState({ minutes: this.state.minutes - 1 });
          this.setState({ seconds: 59 });
        }
      }
    }, 1000);

    this.setState({ interval: interval });
    let timeout = setTimeout(this.renderTimeoutScene, t);
    this.setState({ timeout: timeout });
  };

  handleStartingAppointment = () => {
    if (this.state.nextAppointment) {
      this.startTimer();
      this.setState({ appointmentState: "started" });
      let histObj = this.state.nextAppointment;
      let d = new Date();
      histObj.actualStartTime = d.toLocaleTimeString();
      this.setState({ nextAppointment: histObj });
    }
  };

  handleEndingAppointment = () => {
    clearInterval(this.state.interval);
    clearTimeout(this.state.timeout);
    let histObj = this.state.nextAppointment;
    let d = new Date();
    histObj.actualEndTime = d.toLocaleTimeString();
    histObj._id = d.getTime().toString();

    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
    );
    let ahDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/appointment_history"
    );
    ahDB.put(histObj).catch(function (err) {
      console.log(err);
    });

    let tID = sessionStorage.getItem("Appointment");
    tDB
      .get(tID)
      .then(function (doc) {
        doc.bookedAppointments = doc.bookedAppointments.filter(
          (e) => e.id !== histObj.id
        );
        return tDB.put(doc);
      })
      .catch(function (err) {
        console.log(err);
      });

    this.setState({ scene: "empty" });
  };

  renderTimedOut = () => {
    return (
      <div className="row d-flex justify-content-end">
        <div className="col tutorActiveDiv">
          <div className="row d-flex justify-content-center">
            <button
              className="btn btn-lg qBtn lBtn"
              onClick={this.handleEndingAppointment}
            >
              {" "}
              End Appointment
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderEmptyScene = () => {
    return (
      <div className="row d-flex">
        <div className="col tutorActiveDiv">
          <div className="row d-flex justify-content-center">
            <h3>No Appointments</h3>
          </div>
        </div>
      </div>
    );
  };

  getStudentName = async () => {
    let sDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/students"
    );

    let sPromise = new Promise((resolve, reject) => {
      sDB
        .get(this.state.nextAppointment.studentID)
        .then(function (doc) {
          let fullName = doc.fName + " " + doc.lName;
          resolve(fullName);
        })
        .catch(function (err) {
          reject(err);
        });
    });

    let sResult = await sPromise;
    this.setState({ fullName: sResult });
  };

  renderAppointmentReady = () => {
    return (
      <div className="row d-flex justify-content-end">
        <div className="col tutorActiveDiv">
          <div className="row">
            <div className="col-4">
              <h2>
                {this.state.minutes} : {this.state.seconds}
              </h2>
            </div>
            <div className="col-8">
              <h2>
                {this.state.fullName}-{" "}
                {this.state.nextAppointment
                  ? this.state.nextAppointment.studentID
                  : "Oops"}{" "}
              </h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h3>
                {" "}
                Start Time :{" "}
                {this.state.nextAppointment
                  ? this.state.nextAppointment.startTime
                  : "Oops"}{" "}
              </h3>
              <h3>
                {" "}
                End Time :{" "}
                {this.state.nextAppointment
                  ? this.state.nextAppointment.endTime
                  : "Oops"}
              </h3>
              <h3> {this.setAppointmentStatus()} </h3>
            </div>
          </div>
          <div className="row d-flex justify-content-around">
            {this.state.appointmentState === "readyToStart" ? (
              <button
                className="btn btn-lg qBtn"
                onClick={this.handleStartingAppointment}
              >
                {" "}
                Start Appointment
              </button>
            ) : (
              <button
                className="btn btn-lg qBtn"
                onClick={this.handleEndingAppointment}
              >
                {" "}
                End Appointment
              </button>
            )}
            {this.state.appointmentState === "readyToStart" ? (
              <button className="btn btn-lg qBtn" onClick={this.handleNoShow}>
                {" "}
                No Show
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  renderScene = () => {
    if (this.state.scene === "empty") {
      return this.renderEmptyScene();
    } else if (this.state.scene === "appointmentReady") {
      return this.renderAppointmentReady();
    } else if (this.state.scene === "timedOut") {
      return this.renderTimedOut();
    }
  };

  render() {
    return <>{this.renderScene()}</>;
  }
}

export default AppointmentTutorCurrentAppt;
