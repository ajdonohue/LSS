import React, { Component } from "react";
import { observer } from "mobx-react";
import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";

const dashboardAnalytics = observer(
  class DashboardAnalytics extends Component {
    constructor(props) {
      super(props);
      PouchDB.plugin(PouchdbFind);
      this.state = { appCount: 0, avgLength: 0, highestCat: "", studentTime: 0 };
    }

    componentDidMount = () => {
      this.getAppointmentNumber();
      this.getAvgAppointmentLength();
      this.getMostUsedCat();
      this.getStudentsPerTime()
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

      let matches = await promise;
      let totalLength = 0;
      let aCount = 0;

      matches.docs.forEach((e) => {
        if (e.appointmentStart && e.appointmentEnd) {
          //first colon in time string, used to find position of hours, mins, secs
          let startColon = e.appointmentStart.indexOf(":");
          let endColon = e.appointmentEnd.indexOf(":");

          //handle single or double digit hours (5 or 11)
          let end24 = e.appointmentEnd.substr(e.appointmentEnd.length - 2);
          //console.log(end24);
          let endH;
          if (endColon === 1) {
            endH = parseInt(e.appointmentEnd.charAt(0));
            if (end24 === "PM") {
              if (endH === 12) endH = 0;
              else endH = endH + 12;
            }
          } else if (endColon === 2) {
            endH = parseInt(e.appointmentEnd.substr(0, 1));
            if (end24 === "PM") {
              if (endH === 12) endH = 0;
              else endH = endH + 12;
            }
          }

          let endM = parseInt(
            e.appointmentEnd.substr(endColon + 1, endColon + 2)
          );
          let endS = parseInt(
            e.appointmentEnd.substr(endColon + 4, endColon + 5)
          );

          let start24 = e.appointmentEnd.substr(e.appointmentStart.length - 2);
          let startH;
          if (startColon === 1) {
            startH = parseInt(e.appointmentStart.charAt(0));
            if (start24 === "PM") {
              if (startH === 12) startH = 0;
              else startH = startH + 12;
            }
          } else if (startColon === 2) {
            startH = parseInt(e.appointmentStart.substr(0, 1));
          }

          let startM = parseInt(
            e.appointmentStart.substr(startColon + 1, startColon + 2)
          );
          let startS = parseInt(
            e.appointmentStart.substr(startColon + 4, startColon + 5)
          );
          // console.log("history ID " + e._id);
          // console.log(
          //   "STARTTIME = hour " + startH + " min " + startM + " sec " + startS
          // );
          // console.log(
          //   "ENDTIME = hour " + endH + " min " + endM + " sec " + endS
          // );

          //convert everything to seconds
          let endT = endH * 3600 + endM * 60 + endS;
          let startT = startH * 3600 + startM * 60 + startS;

          let timeToAdd = endT - startT;
          totalLength += timeToAdd;
          aCount += 1;
        } else {
          console.log(e.appointmentStart);
        }

        // //hours match, simple math
        // if (endH === startH) {
        //   let timeToAdd = endT - startT;
        //   console.log("length in minutes " + timeToAdd / 60);
        //   totalLength += timeToAdd;
        //   aCount += 1;
        // } else {
        //   // when end hour is greater than start
        //   //find start minutes to the hour, add to normal end minutes
        //   // will only handle 1 hour difference, but that should be fine for us
        //   let diff1 = 60 - startM;
        //   console.log("start minute difference " + diff1);
        //   console.log("end min " + endM);
        //   let timeToAdd = (diff1 + endM) * 60 - startS + endS;
        //   console.log("length in minutes " + timeToAdd / 60);
        //   totalLength += timeToAdd;
        //   aCount += 1;
        // }
      });

      //calculate average and convert to minutes
      let avgSecs = totalLength / aCount;
      let avg = avgSecs / 60;
      this.setState({ avgLength: avg.toFixed(2) });
    };

    getAppointmentNumber = async () => {
      // var PouchDB = require("pouchdb");
      // PouchDB.plugin(require("pouchdb-find"));
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
      );

      // -- used to create a index, but index seems to persist so only have to call once? --
      // db.createIndex({
      //   index: {
      //     fields: ["tutor"]
      //   }
      // })
      //   .then(function(result) {
      //     // yo, a result
      //   })
      //   .catch(function(err) {
      //     console.log(err);
      //   });

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

      let count = await promise;
      let c = count.docs.length;

      this.setState({ appCount: c });
    };

    //TODO Analytics
  /*
    Students/day,month,year
    New students this month
    Number of students/department
  */

  handleDateInfo(apptDate, time) {

    let date = new Date();
    let date2 = new Date();
    if (time === "day")
      date2.setTime(date2.getTime() - (24*60*60*1000));
    else if (time === "month") {
      date2.setMonth(date2.getMonth() - 1);      
    }
    else if (time === "year") {
      date2.setFullYear(date2.getFullYear() - 1);
    }

    if (apptDate <= date && apptDate >= date2)
      return true;
    else
      return false;
  }

  getStudentsPerTime = async() => {
    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
    );

    let x = this;
    let promise = new Promise((resolve, reject) => {
      db.find({
        selector: {
          tutor: { $eq: x.props.tutorStore.Tutor._id }
        }
      })
        .then(function(result) {
          resolve(result);
        })
        .catch(function(err) {
          console.log(err);
          reject(err);
        });
    });

    let e = document.getElementById("timeWindow");
    let time = e.options[e.selectedIndex].value;
    //console.log(time)
    let matches = await promise;
    let matchList = matches.docs;
    let list = [];

    if (time === "day") {

      matchList.forEach(e => {
        let inList = false;
        let apptDate = new Date (e.date)
        if (list.includes(e.studentID))
            inList = true;
        if (inList === false  && this.handleDateInfo(apptDate, time))
          list.push(e.studentID)
      })

      this.setState({studentTime:list.length});
    }

    else if (time === "month") {

      matchList.forEach(e => {
        let inList = false;
        let apptDate = new Date(e.date)
        if (list.includes(e.studentID))
          inList = true;
        if (inList === false && this.handleDateInfo(apptDate, time))
          list.push(e.studentID)
      })

      this.setState({studentTime:list.length})
    }

    else if (time === "year") {

      matchList.forEach(e => {
        let inList = false;
        let apptDate = new Date(e.date)
        if (list.includes(e.studentID))
          inList = true;
        if (inList === false && this.handleDateInfo(apptDate, time))
          list.push(e.studentID)
      })

      this.setState({studentTime:list.length})
    }

  }

    render() {
      return (
        <div className="container dashAnal">
          <div className="row">
            <div className="col-6">
              <div className="card">
                <div className="card-body">
                  <span>
                    <h5>Number of Completed Appointments</h5>
                  </span>
                  <span>
                    <h6>{this.state.appCount}</h6>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-body">
                  <span>
                    <h5>Number of Students Cancelled</h5>
                  </span>
                  <span>
                    <h6>{this.state.highestCat}</h6>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="card">
                <div className="card-body">
                  <span>
                    <h5>Average Length of Sessions</h5>
                  </span>
                  <span>
                    <h6>{this.state.avgLength} Minutes</h6>
                  </span>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="card">
                <div className="card-body">
                  <span>
                    <h5>Number of No Shows</h5>
                  </span>
                  <span>
                    <h6>NOT DONE YET</h6>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="card">
                <div className="card-body">
                  <span>
                    <h5>Unique students per</h5>
                    <select onChange={this.getStudentsPerTime} id="timeWindow">
                      <option value="day">Day</option>
                      <option value="month">Month</option>
                      <option value="year">Year</option>
                    </select>
                  </span>
                  <span>
                    <h6>{this.state.studentTime}</h6>
                  </span>
                </div>
              </div>
            </div>
            </div>
        </div>
      );
    }
  }
);

export default dashboardAnalytics;
