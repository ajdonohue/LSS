import React, { Component } from "react";
import PouchDB from "pouchdb";
import Modal from "react-bootstrap/Modal";

// --- PROPS ---
// showEdit: handleMondayVisibility(), handleTuesdayVisibility(), handleWednesdayVisibility(), handleThursdayVisibility(), handleFridayVisibility(), addPeerCatTimes(), deleteTimeSlot()
// showMondayTimes: handleMondayVisibility()
// showTuesdayTimes: handleTuesdayVisibility()
// showWednesdayTimes: handleWednesdayVisibility()
// showThursdayTimes: handleThursdayVisibility()
// showFridayTimes: handleFridayVisibility()
// stateTimes: addPeerCatTimes()
// AddNewTimeSlot: handleAddNewTimeSlot()
// day: handleMondayVisibility(), handleTuesdayVisibility(), handleWednesdayVisibility(), handleThursdayVisibility(), handleFridayVisibility(),
// showDeletePopup: showDeletePopupVisability(), hideDeletePopupVisabilty()
// addStartTime: handleStartTimeInput()
// addEndTime: handleEndTimeInput()
// addLocationTime: handleLocationInput()
// addTime: addPeerCatTimes()
// currentPeerCatTimes: fetchPeerCatTimes()
// timeToDelete: handleDeleteTime()
// showDeletetimePopup: hideDeleteTimePopup(), handleDeleteTime()
// --- PROPS ---

class AdminPeerCatRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEdit: false,
      showMondayTimes: false,
      showTuesdayTimes: false,
      showWednesdayTimes: false,
      showThursdayTimes: false,
      showFridayTimes: false,
      stateTimes: [],
      AddNewTimeSlot: false,
      day: "",
      showDeletePopup: false,
      addStartTime: "",
      addEndTime: "",
      addLocationTime: "",
      addTime: [],
      currentPeerCatTimes: [],
      timeToDelete: 0,
      showDeletetimePopup: false,
    };
  }

  handleStartTimeInput = (e) => {
    this.setState({ addStartTime: e.target.value });
  };

  handleEndTimeInput = (e) => {
    this.setState({ addEndTime: e.target.value });
  };

  handleLocationInput = (e) => {
    this.setState({ addLocationTime: e.target.value });
  };

  handleAddNewTimeSlot = () => {
    this.setState({ AddNewTimeSlot: !this.state.AddNewTimeSlot });
  };
  handleMondayVisibility = () => {
    this.setState({
      showEdit: !this.state.showEdit,
      stateTimes: this.props.mondayTimes,
      day: "Monday",
    });
  };

  handleTuesdayVisibility = () => {
    this.setState({
      showEdit: !this.state.showEdit,
      stateTimes: this.props.tuesdayTimes,
      day: "Tuesday",
    });
  };

  handleWednesdayVisibility = () => {
    this.setState({
      showEdit: !this.state.showEdit,
      stateTimes: this.props.wednesdayTimes,
      day: "Wednesday",
    });
  };

  handleThursdayVisibility = () => {
    this.setState({
      showEdit: !this.state.showEdit,
      stateTimes: this.props.thursdayTimes,
      day: "Thursday",
    });
  };

  handleFridayVisibility = () => {
    this.setState({
      showEdit: !this.state.showEdit,
      stateTimes: this.props.fridayTimes,
      day: "Friday",
    });
  };

  showDeletePopupVisability = () => {
    this.setState({ showDeletePopup: true });
  };

  hideDeletePopupVisabilty = () => {
    this.setState({ showDeletePopup: false });
  };

  handleDeletePeerCat = () => {
    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/peer_categories"
    );

    db.get(this.props.id, function err(err, doc) {
      if (err) {
        return console.log(err);
      }
      db.remove(doc, function err(repsonse) {
        if (err) {
          return console.log(err);
        }
      });
    });
    this.hideDeletePopupVisabilty();
  };

  addPeerCatTimes = () => {
    let d = new Date();
    let timesObj = {
      id: d.getTime(),
      start: this.state.addStartTime,
      end: this.state.addEndTime,
      location: this.state.addLocationTime,
    };

    this.state.stateTimes.push(timesObj);
    let newTimes = this.state.stateTimes;

    let day = this.state.day;
    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/peer_categories"
    );
    console.log(day);
    console.log(this.state.stateTimes);
    db.get(this.props.id)
      .then(function (doc) {
        if (day === "Monday") {
          doc.mondayTimes = newTimes;
        } else if (day === "Tuesday") {
          doc.tuesdayTimes = newTimes;
        } else if (day === "Wednesday") {
          doc.wednesdayTimes = newTimes;
        } else if (day === "Thursday") {
          doc.thursdayTimes = newTimes;
        } else if (day === "Friday") {
          doc.fridayTimes = newTimes;
        }
        return db.put(doc);
      })
      .then(() => {
        return db.get(this.props.id);
      })
      .catch(function (err) {
        console.log(err);
      });

    this.setState({ showEdit: false });
    this.handleAddNewTimeSlot();
  };
  handleDeleteTime = (e) => {
    this.setState({ timeToDelete: e.target.value, showDeletetimePopup: true });
  };

  hideDeleteTimePopup = () => {
    this.setState({ showDeletetimePopup: false });
  };

  deleteTimeSlot = () => {
    let times = this.state.stateTimes;
    //let index = times.indexOf(this.state.timeToDelete);
    console.log(times);
    console.log(this.state.timeToDelete);

    times.splice(this.state.timeToDelete, 1);
    console.log(times);
    let day = this.state.day;
    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/peer_categories"
    );
    db.get(this.props.id)
      .then(function (doc) {
        if (day === "Monday") {
          doc.mondayTimes = times;
        } else if (day === "Tuesday") {
          doc.tuesdayTimes = times;
        } else if (day === "Wednesday") {
          doc.wednesdayTimes = times;
        } else if (day === "Thursday") {
          doc.thursdayTimes = times;
        } else if (day === "Friday") {
          doc.fridayTimes = times;
        }
        return db.put(doc);
      })
      .then(() => {
        return db.get(this.props.id);
      })
      .catch(function (err) {
        console.log(err);
      });

    this.setState({ showEdit: false });
    this.hideDeleteTimePopup();
  };

  renderPeerCategories = () => {
    return (
      <div className="container">
        <div
          className={
            this.props.rowType
              ? "row d-flex justify-content-center trueRow"
              : "row d-flex justify-content-center falseRow"
          }
        >
          <div className="col">
            <div className="row d-flex justify-content-around">
              <h3>Department: {this.props.department}</h3>
              <button
                className="btn btn-lg tutorBtn justify-content-end"
                onClick={this.showDeletePopupVisability}
              >
                Delete
              </button>
            </div>

            <div className="row d-flex justify-content-center btn-group">
              <button
                className="btn btn-lg dayBtn"
                onClick={this.handleMondayVisibility}
              >
                Mon
              </button>
              <button
                className="btn btn-lg dayBtn"
                onClick={this.handleTuesdayVisibility}
              >
                Tues
              </button>
              <button
                className="btn btn-lg dayBtn"
                onClick={this.handleWednesdayVisibility}
              >
                Wed
              </button>
              <button
                className="btn btn-lg dayBtn"
                onClick={this.handleThursdayVisibility}
              >
                Thurs
              </button>
              <button
                className="btn btn-lg dayBtn"
                onClick={this.handleFridayVisibility}
              >
                Fri
              </button>
            </div>
            <Modal show={this.state.showDeletePopup}>
              <Modal.Header>
                <Modal.Title>Warning</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete {this.state.department} once
                deleted it cannot be reversed!
              </Modal.Body>
              <Modal.Footer>
                {" "}
                <button
                  onClick={this.hideDeletePopupVisabilty}
                  className="btn btn-secondary"
                >
                  No
                </button>{" "}
                <button
                  onClick={this.handleDeletePeerCat}
                  className="btn btn-primary"
                >
                  Yes
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        <div className={this.state.showEdit ? "showEdit" : "hideEdit"}>
          <div className="col">
            {this.state.stateTimes.map((times, index) => (
              <div>
                <div
                  className={
                    this.props.rowType
                      ? "row d-flex trueEditRow"
                      : "row d-flex falseEditRow"
                  }
                >
                  <div className="col text-center">
                    <h4>Time Slot</h4>
                  </div>
                  <button
                    className="btn btn-lg tutorBtn float-right"
                    value={index}
                    onClick={(e) => this.handleDeleteTime(e, "value")}
                  >
                    Delete
                  </button>
                </div>
                <Modal show={this.state.showDeletetimePopup}>
                  <Modal.Header>
                    <Modal.Title>Warning</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you want to delete this time slot once deleted
                    it cannot be reversed!
                  </Modal.Body>
                  <Modal.Footer>
                    {" "}
                    <button
                      onClick={this.hideDeleteTimePopup}
                      className="btn btn-secondary"
                    >
                      No
                    </button>{" "}
                    <button
                      onClick={this.deleteTimeSlot}
                      className="btn btn-primary"
                    >
                      Yes
                    </button>
                  </Modal.Footer>
                </Modal>
                <div
                  className={
                    this.props.rowType
                      ? "row d-flex trueEditRow"
                      : "row d-flex falseEditRow"
                  }
                >
                  <div className="col-6 text-center">
                    <h4>Start Time</h4>
                  </div>
                  <div className="col-6 text-center">
                    <h4>{times.start}</h4>
                  </div>
                </div>
                <div className="d-none">{times.id}</div>
                <div
                  className={
                    this.props.rowType
                      ? "row d-flex trueEditRow"
                      : "row d-flex falseEditRow"
                  }
                >
                  <div className="col-6 text-center">
                    <h4>End Time</h4>
                  </div>
                  <div className="col-6 text-center">
                    <h4>{times.end}</h4>
                  </div>
                </div>
                <div
                  className={
                    this.props.rowType
                      ? "row d-flex trueEditRow"
                      : "row d-flex falseEditRow"
                  }
                >
                  <div className="col-6 text-center">
                    <h4>Location</h4>
                  </div>
                  <div className="col-6 text-center">
                    <h4>{times.location}</h4>
                  </div>
                </div>
              </div>
            ))}
            <div
              className={this.state.AddNewTimeSlot ? "showEdit" : "hideEdit"}
            >
              <div className="col">
                <div
                  className={
                    this.props.rowType
                      ? "row d-flex trueEditRow"
                      : "row d-flex falseEditRow"
                  }
                >
                  <div className="col text-center">
                    <h4>Add New Time Slot</h4>
                  </div>
                  <button className="btn btn-lg tutorBtn float-right">
                    Delete
                  </button>
                </div>
                <div
                  className={
                    this.props.rowType
                      ? "row d-flex trueEditRow"
                      : "row d-flex falseEditRow"
                  }
                >
                  <div className="col-6 text-center">
                    <h4>Start Time</h4>
                  </div>
                  <div className="col-6 text-center">
                    <select
                      className="form-control"
                      onChange={this.handleEndTimeInput}
                    >
                      <option value="7:00:00 AM">7:00 AM</option>
                      <option value="7:15:00 AM">7:15 AM</option>
                      <option value="7:30:00 AM">7:30 AM</option>
                      <option value="7:45:00 AM">7:45 AM</option>
                      <option value="8:00:00 AM">8:00 AM</option>
                      <option value="8:15:00 AM">8:15 AM</option>
                      <option value="8:30:00 AM">8:30 AM</option>
                      <option value="8:45:00 AM">8:45 AM</option>
                      <option value="9:00:00 AM">9:00 AM</option>
                      <option value="9:15:00 AM">9:15 AM</option>
                      <option value="9:30:00 AM">9:30 AM</option>
                      <option value="9:45:00 AM">9:45 AM</option>
                      <option value="10:00:00 AM">10:00 AM</option>
                      <option value="10:15:00 AM">10:15 AM</option>
                      <option value="10:30:00 AM">10:30 AM</option>
                      <option value="10:45:00 AM">10:45 AM</option>
                      <option value="11:00:00 AM">11:00 AM</option>
                      <option value="11:15:00 AM">11:15 AM</option>
                      <option value="11:30:00 AM">11:30 AM</option>
                      <option value="11:45:00 AM">11:45 AM</option>
                      <option value="12:00:00 PM">12:00 PM</option>
                      <option value="12:15:00 PM">12:15 PM</option>
                      <option value="12:30:00 PM">12:30 PM</option>
                      <option value="12:45:00 PM">12:45 PM</option>
                      <option value="1:00:00 PM">1:00 PM</option>
                      <option value="1:15:00 PM">1:15 PM</option>
                      <option value="1:30:00 PM">1:30 PM</option>
                      <option value="1:45:00 PM">1:45 PM</option>
                      <option value="2:00:00 PM">2:00 PM</option>
                      <option value="2:15:00 PM">2:15 PM</option>
                      <option value="2:30:00 PM">2:30 PM</option>
                      <option value="2:45:00 PM">2:45 PM</option>
                      <option value="3:00:00 PM">3:00 PM</option>
                      <option value="3:15:00 PM">3:15 PM</option>
                      <option value="3:30:00 PM">3:30 PM</option>
                      <option value="3:45:00 PM">3:45 PM</option>
                      <option value="4:00:00 PM">4:00 PM</option>
                      <option value="4:15:00 PM">4:15 PM</option>
                      <option value="4:30:00 PM">4:30 PM</option>
                      <option value="4:45:00 PM">4:45 PM</option>
                      <option value="5:00:00 PM">5:00 PM</option>
                      <option value="5:15:00 PM">5:15 PM</option>
                      <option value="5:30:00 PM">5:30 PM</option>
                      <option value="5:45:00 PM">5:45 PM</option>
                      <option value="6:00:00 PM">6:00 PM</option>
                    </select>
                  </div>
                </div>
                <div
                  className={
                    this.props.rowType
                      ? "row d-flex trueEditRow"
                      : "row d-flex falseEditRow"
                  }
                >
                  <div className="col-6 text-center">
                    <h4>End Time</h4>
                  </div>
                  <div className="col-6 text-center">
                    <select
                      className="form-control"
                      onChange={this.handleEndTimeInput}
                    >
                      <option value="7:00:00 AM">7:00 AM</option>
                      <option value="7:15:00 AM">7:15 AM</option>
                      <option value="7:30:00 AM">7:30 AM</option>
                      <option value="7:45:00 AM">7:45 AM</option>
                      <option value="8:00:00 AM">8:00 AM</option>
                      <option value="8:15:00 AM">8:15 AM</option>
                      <option value="8:30:00 AM">8:30 AM</option>
                      <option value="8:45:00 AM">8:45 AM</option>
                      <option value="9:00:00 AM">9:00 AM</option>
                      <option value="9:15:00 AM">9:15 AM</option>
                      <option value="9:30:00 AM">9:30 AM</option>
                      <option value="9:45:00 AM">9:45 AM</option>
                      <option value="10:00:00 AM">10:00 AM</option>
                      <option value="10:15:00 AM">10:15 AM</option>
                      <option value="10:30:00 AM">10:30 AM</option>
                      <option value="10:45:00 AM">10:45 AM</option>
                      <option value="11:00:00 AM">11:00 AM</option>
                      <option value="11:15:00 AM">11:15 AM</option>
                      <option value="11:30:00 AM">11:30 AM</option>
                      <option value="11:45:00 AM">11:45 AM</option>
                      <option value="12:00:00 PM">12:00 PM</option>
                      <option value="12:15:00 PM">12:15 PM</option>
                      <option value="12:30:00 PM">12:30 PM</option>
                      <option value="12:45:00 PM">12:45 PM</option>
                      <option value="1:00:00 PM">1:00 PM</option>
                      <option value="1:15:00 PM">1:15 PM</option>
                      <option value="1:30:00 PM">1:30 PM</option>
                      <option value="1:45:00 PM">1:45 PM</option>
                      <option value="2:00:00 PM">2:00 PM</option>
                      <option value="2:15:00 PM">2:15 PM</option>
                      <option value="2:30:00 PM">2:30 PM</option>
                      <option value="2:45:00 PM">2:45 PM</option>
                      <option value="3:00:00 PM">3:00 PM</option>
                      <option value="3:15:00 PM">3:15 PM</option>
                      <option value="3:30:00 PM">3:30 PM</option>
                      <option value="3:45:00 PM">3:45 PM</option>
                      <option value="4:00:00 PM">4:00 PM</option>
                      <option value="4:15:00 PM">4:15 PM</option>
                      <option value="4:30:00 PM">4:30 PM</option>
                      <option value="4:45:00 PM">4:45 PM</option>
                      <option value="5:00:00 PM">5:00 PM</option>
                      <option value="5:15:00 PM">5:15 PM</option>
                      <option value="5:30:00 PM">5:30 PM</option>
                      <option value="5:45:00 PM">5:45 PM</option>
                      <option value="6:00:00 PM">6:00 PM</option>
                    </select>
                  </div>
                </div>
                <div
                  className={
                    this.props.rowType
                      ? "row d-flex trueEditRow"
                      : "row d-flex falseEditRow"
                  }
                >
                  <div className="col-6 text-center">
                    <h4>Location</h4>
                  </div>
                  <div className="col-6 text-center">
                    <input
                      className="form-control"
                      //defaultValue={times.location}
                      onChange={this.handleLocationInput}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={
                this.props.rowType
                  ? "row d-flex justify-content-center trueEditRow"
                  : "row d-flex justify-content-center falseEditRow"
              }
            >
              {this.state.AddNewTimeSlot ? (
                <div>
                  <button
                    className="btn btn-lg tutorBtn"
                    onClick={this.addPeerCatTimes}
                  >
                    Add Time to {this.state.day}
                  </button>
                  <button
                    className="btn btn-lg tutorBtn"
                    onClick={this.handleAddNewTimeSlot}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="btn btn-lg tutorBtn"
                    onClick={this.handleAddNewTimeSlot}
                  >
                    Add New Time
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  fetchPeerCatTimes = async () => {
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/peer_categories"
    );

    let tPromise = new Promise((resolve, reject) => {
      tDB
        .allDocs({
          include_docs: true,
          attachments: true,
        })
        .then(function (docs) {
          resolve(docs.rows);
        })
        .catch(function (err) {
          reject(console.log(err));
        });
    });

    let tResult = await tPromise;
    await this.setState({ currentPeerCatTimes: tResult });
  };

  renderPeerCatTime = () => {
    return;
  };
  render() {
    return <>{this.renderPeerCategories()}</>;
  }
}
export default AdminPeerCatRender;
