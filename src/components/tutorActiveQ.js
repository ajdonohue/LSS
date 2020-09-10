import React, { Component } from "react";
import "../css/tutorActiveQ.css";
import PouchDB from "pouchdb";
import { observer } from "mobx-react";
import { get, toJS } from "mobx";
import TutorStore from "../model/tutorStore";
import CountUpTimer from "./countdownTimer";

//
// Props
//
// activeQ - The current q object being served
//

// scenes - empty, readyToStart, timedOut
// appointmentStates - readyToStart, Started,  Extended, Ended

const tutorActiveQ = observer(
  class TutorActiveQ extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isFull: false,
        appointmentState: null,
        minutes: 0,
        seconds: 0,
        scene: "empty",
        AA: null,
        interval: null,
        timeout: null,
        started: false,
      };
    }

    componentDidMount = () => {
      let tdb = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
      );

      tdb
        .changes({ since: "now", live: true, include_docs: true })
        .on("change", () => {
          this.checkActiveAppointment();
        });

      this.checkActiveAppointment();
    };

    componentDidUpdate = (prevProps) => {
      // if (this.props.activeQ !== prevProps.activeQ) {
      //   this.setState({
      //     isFull: true,
      //     appointmentState: "readyToStart",
      //     scene: "appointmentReady"
      //   });
      // }
    };

    checkActiveAppointment = async () => {
      let tdb = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
      );

      let tttt = this;
      let t = this.props.tID;
      console.log(t);
      let aPromise = new Promise((resolve, reject) => {
        tdb
          .get(t)
          .then(function (doc) {
            if (Object.keys(doc.activeAppointment).length !== 0) {
              if (doc.activeAppointment.appointmentStart !== 0)
                tttt.setState({
                  started: true,
                  appointmentState: "started",
                  scene: "appointmentReady",
                });
              else if (doc.activeAppointment.appointmentEnd === 0) {
                tttt.setState({
                  isFull: true,
                  appointmentState: "readyToStart",
                  scene: "appointmentReady",
                });
              }
              resolve(doc.activeAppointment);
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      });

      let appointment = await aPromise;
    };

    setAppointmentStatus = () => {
      if (this.state.appointmentState === "readyToStart") {
        return "Appointment is ready to start";
      } else if (this.state.appointmentState === "started") {
        return "Appointment is started";
      } else if (this.state.appointmentState === "extended") {
        return "Appointment is extended";
      } else return "No appointment status";
    };

    handleStartingAppointment = () => {
      this.startTimer();
      let currentAppointment = toJS(
        this.props.tutorStore.Tutor.activeAppointment,
        false
      );
      if (currentAppointment) {
        console.log(currentAppointment.id);
        this.props.tutorStore.StartAppointment(currentAppointment.id);
        this.setState({ appointmentState: "started" });
      }
    };

    handleEndingAppointment = () => {
      console.log(this.props.activeQ);
      this.props.tutorStore.EndAppointment();
      clearInterval(this.state.interval);
      clearTimeout(this.state.timeout);
      this.setState({ scene: "empty" });
    };

    handleNoShow = () => {
      this.props.tutorStore.NoShow();
      clearInterval(this.state.interval);
      clearTimeout(this.state.timeout);
      this.setState({ scene: "empty" });
    };

    setExtendScene = () => {
      this.setState({ scene: "extended" });
    };

    renderTimeoutScene = () => {
      this.setState({ scene: "timedOut" });
      clearInterval(this.state.interval);
      if (this.state.timeout) clearTimeout(this.state.timeout);
    };

    startTimer = async () => {
      //this is the proper value to use, for testing just setting to a minute
      //await this.setState({ minutes: this.props.tutorStore.QLength });
      await this.setState({ minutes: 1, seconds: 0 });
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

    renderActiveQ = () => {
      let currentAppointment = toJS(
        this.props.tutorStore.Tutor.activeAppointment,
        false
      );
      if (currentAppointment) {
        console.log(currentAppointment.studentID);
      }
      return (
        <div className="container">
          <div className="row d-flex justify-content-end">
            <div className="tutorActiveDiv">
              <div className="row">
                <div className="col-4 text-center">
                  <h2>
                    {this.state.minutes} : {this.state.seconds}
                  </h2>
                </div>
                <div className="col-8 text-center">
                  {" "}
                  <h2>
                    Student Name -
                    {currentAppointment ? currentAppointment.studentID : "Oops"}
                  </h2>{" "}
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                <h3>{this.setAppointmentStatus()}</h3>
              </div>
              <div className="row d-flex justify-content-between">
                {this.state.appointmentState === "readyToStart" ? (
                  <button
                    className="btn btn-lg qBtn lBtn"
                    onClick={this.handleStartingAppointment}
                  >
                    {" "}
                    Start Appointment
                  </button>
                ) : (
                  <button
                    className="btn btn-lg qBtn lBtn"
                    onClick={this.handleEndingAppointment}
                  >
                    {" "}
                    End Appointment
                  </button>
                )}
                {this.state.started ? null : (
                  <button
                    className="btn btn-lg qBtn rBtn d-flex flex-row-reverse"
                    onClick={this.handleNoShow}
                  >
                    {" "}
                    No Show
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    };

    renderExtendedQ = () => {
      let currentAppointment = toJS(
        this.props.tutorStore.Tutor.activeAppointment,
        false
      );
      if (currentAppointment) {
        console.log(currentAppointment.studentID);
      }
      return (
        <div className="container">
          <div className="row d-flex justify-content-end">
            <div className="tutorActiveDiv">
              <div className="row">
                <div className="col-4 text-center">
                  <h2>
                    <CountUpTimer />
                  </h2>
                </div>
                <div className="col-8 text-center">
                  {" "}
                  <h2>
                    Student Name -
                    {currentAppointment ? currentAppointment.studentID : "Oops"}
                  </h2>{" "}
                </div>
              </div>
              <div className="row d-flex justify-content-center">
                <h3>{this.setAppointmentStatus()}</h3>
              </div>
              <div className="row d-flex justify-content-around">
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
        </div>
      );
    };

    renderEmptyQ = () => {
      return (
        <div className="container">
          <div className="tutorActiveDiv">
            <div className="row">
              <h3>No Appointment Selected</h3>
            </div>
          </div>
        </div>
      );
    };

    renderTimedOut = () => {
      return (
        <div className="container">
          <div className="row d-flex justify-content-end">
            <div className="tutorActiveDiv">
              <div className="row d-flex justify-content-between">
                <button
                  className="btn btn-lg qBtn lBtn"
                  onClick={this.setExtendScene}
                >
                  {" "}
                  Extend Appointment
                </button>
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
        </div>
      );
    };

    renderScene = () => {
      if (this.state.scene === "empty") {
        return this.renderEmptyQ();
      } else if (this.state.scene === "appointmentReady") {
        return this.renderActiveQ();
      } else if (this.state.scene === "timedOut") {
        return this.renderTimedOut();
      } else if (this.state.scene === "extended") {
        return this.renderExtendedQ();
      }
    };

    render() {
      return <div>{this.renderScene()}</div>;
    }
  }
);

export default tutorActiveQ;
