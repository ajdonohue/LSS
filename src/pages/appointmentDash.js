import React, { Component } from "react";
import PouchDB from "pouchdb";
import ApptSideNav from "../components/apptSideNav";
import AppointmentTutorList from "../components/appointmentTutorList";
import AppointmentTutorCurrentAppt from "../components/appointmentTutorCurrentAppt";
import QNote from "../components/qNote";

//
//Props-
//
//bookAppointments: an array of appointments which are booked

class AppointmentDashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { bookedAppointments: [] };
  }

  componentDidMount = async () => {
    let tID = sessionStorage.getItem("Appointment");
    console.log(tID);
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
    );
    this.fetchAppointments(tID);
    tDB
      .changes({ since: "now", live: true, include_docs: true })
      .on("change", () => {
        this.fetchAppointments(tID);
      });
  };

  fetchAppointments = async (tID) => {
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
    );

    let tutorPromise = new Promise((resolve, reject) => {
      tDB
        .get(tID)
        .then(function (doc) {
          resolve(doc.bookedAppointments);
        })
        .catch(function (err) {
          reject(err);
        });
    });

    let currentAppointments = await tutorPromise;
    console.log(currentAppointments);
    let sortedAppointments = this.sortAppointments(currentAppointments);
    this.setState({ bookedAppointments: sortedAppointments });
  };

  sortAppointments = (appts) => {
    let len = appts.length;
    for (let i = 0; i < len; ++i) {
      for (let j = 0; j < len - 1; ++j) {
        let firstDate = new Date(appts[j].date);
        let secondDate = new Date(appts[j + 1].date);
        if (firstDate.getTime() > secondDate.getTime()) {
          let temp = appts[j];
          appts[j] = appts[j + 1];
          appts[j + 1] = temp;
        } else if (firstDate.getTime() === secondDate.getTime()) {
          let firstTime = this.convertTimeStringTo24(appts[j].startTime);
          let secondTime = this.convertTimeStringTo24(appts[j + 1].startTime);
          if (firstTime > secondTime) {
            let temp = appts[j];
            appts[j] = appts[j + 1];
            appts[j + 1] = temp;
          }
        }
      }
    }
    return appts;
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

  render() {
    return (
      <div className="wrapper">
        <ApptSideNav
          tutorStore={this.props.tutorStore}
          history={this.props.history}
          analytics={this.handleAnalyticsScene}
          home={this.handleHomeScene}
        />
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2">
            <div className="col ">
              <AppointmentTutorList
                appointments={this.state.bookedAppointments}
              />
            </div>
            <div className="col">
              <AppointmentTutorCurrentAppt
                sortedAppointments={this.state.bookedAppointments}
              />
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-2">
            {this.state.bookedAppointments.length !== 0 ? (
              <QNote sID={this.state.bookedAppointments[0].studentID} />
            ) : (
              <QNote />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AppointmentDashboard;
