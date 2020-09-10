import React, { Component } from "react";
import { observer } from "mobx-react";
import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
import "../css/dashboardAnalytics.css";

// --- PROPS ---
// appCount: is the count of students who came for help for that Tutor
// avgLength: is the average wait time a student had to wait to see a tutor
// highestCat: is the most used Category for tutoring
// studentTime: is the time the student spent with the tutor
// newMonthly: is the new unquie students that came for tutoring
// studentDept: is the depertment the student is studing
// noShows: is the number of no shows that happened
// --- PROPS ---

const dashboardAnalytics = observer(
  class DashboardAnalytics extends Component {
    constructor(props) {
      super(props);
      PouchDB.plugin(PouchdbFind);
      this.state = {
        appCount: 0,
        avgLength: 0,
        highestCat: "",
        studentTime: 0,
        newMonthly: 0,
        studentDept: 0,
        noShows: 0,
      };
    }

    componentDidMount = () => {
      this.getAppointmentNumber();
      console.log(this.state.appCount);
      this.getAvgAppointmentLength();
      this.getMostUsedCat();
      this.getNoShows();
      this.getStudentsPerTime();
      this.newThisMonth();
      this.getStudentsPerDept();
    };

    getMostUsedCat = async () => {
      let pdb = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
      );
      let promiseX = new Promise((resolve, reject) => {
        pdb
          .allDocs({
            include_docs: true,
          })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            reject(err);
          });
      });
      let catProm = await promiseX;
      let catArr = [];
      catProm.rows.forEach((e) => {
        let catOb = { name: e.id, count: 0 };
        catArr.push(catOb);
      });
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
      );
      let promiseY = new Promise((resolve, reject) => {
        db.allDocs({
          include_docs: true,
        })
          .then(function (doc) {
            resolve(doc);
          })
          .catch(function (err) {
            reject(err);
          });
      });
      let histProm = await promiseY;
      histProm.rows.forEach((e) => {
        catArr.forEach((i) => {
          if (i.name === e.doc.programID) {
            i.count += 1;
          }
        });
      });
      let high = 0;
      let highCat = "";
      catArr.forEach((e) => {
        if (e.count > high) {
          high = e.count;
          highCat = e.name;
        }
      });
      this.setState({ highestCat: highCat });
    };
    //calculate a tutors average appointment length
    getAvgAppointmentLength = async () => {
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
      );

      let x = this;
      let promise = new Promise((resolve, reject) => {
        db.find({
          selector: {
            tutor: { $eq: x.props.tutorStore.Tutor._id },
          },
        })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          });
      });

      let option = document.getElementById("timeSelectLength");
      let time = option.options[option.selectedIndex].value;
      let matches = await promise;
      let totalLength = 0;
      let aCount = 0;

      matches.docs.forEach((e) => {
        let apptDateStart = new Date(e.date);
        let apptDateEnd = new Date(e.date);
        if (
          e.appointmentStart &&
          e.appointmentEnd &&
          this.handleDateInfo(apptDateStart, time)
        ) {
          let s = e.appointmentStart.split(":");
          if (s[2].endsWith("PM") === true) {
            s[0] = parseInt(s[0]) + 12;
            s[0] = s[0].toString();
          }
          s[2] = s[2].substr(0, 2);

          let en = e.appointmentEnd.split(":");
          if (en[2].endsWith("PM") === true) {
            en[0] = parseInt(en[0]) + 12;
            en[0] = en[0].toString();
          }
          en[2] = en[2].substr(0, 2);

          apptDateStart.setHours(s[0], s[1], s[2]);
          apptDateEnd.setHours(en[0], en[1], en[2]);
          totalLength += (apptDateEnd - apptDateStart) / 60000;
          aCount += 1;
        }
      });

      //calculate average and convert to minutes
      let avg = totalLength / aCount;
      this.setState({ avgLength: avg.toFixed(2) });
    };

    getAppointmentNumber = async () => {
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
      );

      let x = this;
      let promise = new Promise((resolve, reject) => {
        db.find({
          selector: {
            tutor: { $eq: x.props.tutorStore.Tutor._id },
          },
        })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          });
      });

      let option = document.getElementById("timeSelectAppt");
      let time = option.options[option.selectedIndex].value;
      let matches = await promise;
      let matchList = matches.docs;
      let list = [];

      matchList.forEach((e) => {
        let apptDate = new Date(e.date);
        if (this.handleDateInfo(apptDate, time)) list.push(e.studentID);
      });

      this.setState({ appCount: list.length });
    };

    handleDateInfo(apptDate, time) {
      let date = new Date();
      let date2 = new Date();
      if (time === "day") date2.setTime(date2.getTime() - 24 * 60 * 60 * 1000);
      else if (time === "month" || time === "monthInv") {
        date2.setMonth(date2.getMonth() - 1);
      } else if (time === "year") {
        date2.setFullYear(date2.getFullYear() - 1);
      }

      if (apptDate <= date && apptDate >= date2 && time !== "monthInv")
        return true;
      else if (apptDate < date2 && time === "monthInv") return true;
      else return false;
    }

    getStudentsPerTime = async () => {
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
      );

      let x = this;
      let promise = new Promise((resolve, reject) => {
        db.find({
          selector: {
            tutor: { $eq: x.props.tutorStore.Tutor._id },
          },
        })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          });
      });

      let option = document.getElementById("timeWindow");
      let time = option.options[option.selectedIndex].value;
      let matches = await promise;
      let matchList = matches.docs;
      let list = [];

      if (time === "day") {
        matchList.forEach((e) => {
          let inList = false;
          let apptDate = new Date(e.date);
          if (list.includes(e.studentID)) inList = true;
          if (inList === false && this.handleDateInfo(apptDate, time))
            list.push(e.studentID);
        });

        this.setState({ studentTime: list.length });
      } else if (time === "month") {
        matchList.forEach((e) => {
          let inList = false;
          let apptDate = new Date(e.date);
          if (list.includes(e.studentID)) inList = true;
          if (inList === false && this.handleDateInfo(apptDate, time))
            list.push(e.studentID);
        });

        this.setState({ studentTime: list.length });
      } else if (time === "year") {
        matchList.forEach((e) => {
          let inList = false;
          let apptDate = new Date(e.date);
          if (list.includes(e.studentID)) inList = true;
          if (inList === false && this.handleDateInfo(apptDate, time))
            list.push(e.studentID);
        });

        this.setState({ studentTime: list.length });
      }
    };

    newThisMonth = async () => {
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
      );

      let x = this;
      let promise = new Promise((resolve, reject) => {
        db.find({
          selector: {
            tutor: { $eq: x.props.tutorStore.Tutor._id },
          },
        })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          });
      });

      let matches = await promise;
      let matchList = matches.docs;
      let list = [];
      let time = "month";

      matchList.forEach((e) => {
        let inList = false;
        let apptDate = new Date(e.date);
        if (list.includes(e.studentID)) inList = true;
        if (inList === false && this.handleDateInfo(apptDate, time))
          list.push(e.studentID);
      });

      matchList.forEach((e) => {
        let apptDate = new Date(e.date);
        if (
          list.includes(e.studentID) &&
          this.handleDateInfo(apptDate, "monthInv")
        ) {
          list = list.filter(function (value, index, arr) {
            return value !== e.studentID;
          });
        }
      });

      this.setState({ newMonthly: list.length });
    };

    getStudentsPerDept = async () => {
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
      );

      let x = this;
      let promise = new Promise((resolve, reject) => {
        db.find({
          selector: {
            tutor: { $eq: x.props.tutorStore.Tutor._id },
          },
        })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          });
      });

      let option = document.getElementById("timeSelect");
      let time = option.options[option.selectedIndex].value;
      let deptOption = document.getElementById("deptSelect");
      let dept = deptOption.options[deptOption.selectedIndex].value;
      let matches = await promise;
      let matchList = matches.docs;
      let list = [];

      matchList.forEach((e) => {
        let inList = false;
        let apptDate = new Date(e.date);
        if (list.includes(e.studentID)) inList = true;
        if (
          inList === false &&
          this.handleDateInfo(apptDate, time) &&
          e.programID === dept
        )
          list.push(e.studentID);
      });

      this.setState({ studentDept: list.length });
    };

    getNoShows = async () => {
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
      );

      let x = this;
      let promise = new Promise((resolve, reject) => {
        db.find({
          selector: {
            tutor: { $eq: x.props.tutorStore.Tutor._id },
          },
        })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          });
      });

      let option = document.getElementById("timeSelectNoShow");
      let time = option.options[option.selectedIndex].value;
      let matches = await promise;
      let matchList = matches.docs;
      let list = [];

      matchList.forEach((e) => {
        let apptDate = new Date(e.date);
        if (this.handleDateInfo(apptDate, time) && e.noShow === true)
          list.push(e.studentID);
      });

      this.setState({ noShows: list.length });
    };

    render() {
      return (
        <div className="container dashAnal">
          <div className="row">
            <div className="col-6">
              <div className="card-body cardBG">
                <h5>Number of Completed Appointments</h5>
                <div className="row d-flex justify-content-center">
                  <select
                    className="form-control"
                    onChange={this.getAppointmentNumber}
                    id="timeSelectAppt"
                  >
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
                <div className="row d-flex justify-content-center">
                  <h5>{this.state.appCount}</h5>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card-body cardBG">
                <h5>Number of No Shows</h5>
                <div className="row d-flex justify-content-center">
                  <select
                    className="form-control"
                    onChange={this.getNoShows}
                    id="timeSelectNoShow"
                  >
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
                <div className="row d-flex justify-content-center">
                  <h5>{this.state.noShows}</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="card-body cardBG">
                <h5>Average Length of Sessions</h5>
                <div className="row d-flex justify-content-center">
                  <select
                    className="form-control"
                    onChange={this.getAvgAppointmentLength}
                    id="timeSelectLength"
                  >
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
                <div className="row d-flex justify-content-center">
                  <h5>{this.state.avgLength} Minutes</h5>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card-body cardBG">
                <h5>Unique students per</h5>
                <div className="row">
                  <select
                    className="form-control"
                    onChange={this.getStudentsPerTime}
                    id="timeWindow"
                  >
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
                <div className="row d-flex justify-content-center">
                  <h5>{this.state.studentTime}</h5>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="card-body cardBG">
                <h4>Unique students per</h4>
                <h5>Time Chunk</h5>
                <div className="row">
                  <select
                    className="form-control"
                    onChange={this.getStudentsPerDept}
                    id="timeSelect"
                  >
                    <option value="day">Day</option>
                    <option value="month">Month</option>
                    <option value="year">Year</option>
                  </select>
                </div>
                <div className="row d-flex justify-content-center">
                  <h5>Program</h5>
                  <select
                    className="form-control"
                    onChange={this.getStudentsPerDept}
                    id="deptSelect"
                  >
                    <option value="Creative Technologies">
                      Creative Technologies
                    </option>
                    <option value="Health and Wellness">
                      Health and Wellness
                    </option>
                    <option value="Learning Coach">Learning Coach</option>
                    <option value="Reading">Reading</option>
                    <option value="Writing">Writing</option>
                  </select>
                </div>
                <div className="row d-flex justify-content-center">
                  <h5>{this.state.studentDept}</h5>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card-body cardBG">
                <span>
                  <h4>New students this month</h4>
                </span>
                <span>
                  <h5>{this.state.newMonthly}</h5>
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
);

export default dashboardAnalytics;
