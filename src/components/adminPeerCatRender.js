import React, { Component } from "react";
import PouchDB from "pouchdb";
import Modal from "react-bootstrap/Modal";

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
    };
  }
  componentDidMount = async () => {
    console.log(this.props.mondayTimes);
    console.log(this.state.showMondayTimes);
  };

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
    let timesObj = {
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
        }
        return db.put(doc);
      })
      .then(() => {
        return db.get(this.props.id);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  renderPeerCategories = () => {
    return (
      <>
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
                className="btn btn-lg tutorBtn"
                onClick={this.showDeletePopupVisability}
              >
                Delete
              </button>
            </div>

            <div className="row d-flex justify-content-center btn-group">
              <button
                className="btn btn-lg tutorBtn"
                onClick={this.handleMondayVisibility}
              >
                Mon
              </button>
              <button
                className="btn btn-lg tutorBtn"
                onClick={this.handleTuesdayVisibility}
              >
                Tues
              </button>
              <button
                className="btn btn-lg tutorBtn"
                onClick={this.handleWednesdayVisibility}
              >
                Wed
              </button>
              <button
                className="btn btn-lg tutorBtn"
                onClick={this.handleThursdayVisibility}
              >
                Thurs
              </button>
              <button
                className="btn btn-lg tutorBtn"
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
                  //onClick={this.handleDeleteTutor}
                  className="btn btn-primary"
                >
                  Yes
                </button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
        <div className={this.state.showEdit ? "showEdit" : "hideEdit"}>
          <div className="container-fluid">
            <div>
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
                      <h4>{this.state.day} Time Slot</h4>
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
                      <input
                        className="form-control"
                        defaultValue={times.start}
                        // onChange={this.handleRoleInput}
                      />
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
                      <input
                        className="form-control"
                        defaultValue={times.end}
                        // onChange={this.handleRoleInput}
                      />
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
                        defaultValue={times.location}
                        // onChange={this.handleRoleInput}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              className={this.state.AddNewTimeSlot ? "showEdit" : "hideEdit"}
            >
              <div className="container-fluid">
                <div
                  className={
                    this.props.rowType
                      ? "row d-flex trueEditRow"
                      : "row d-flex falseEditRow"
                  }
                >
                  <div className="col text-center">
                    <h4>{this.state.day} Time Slot</h4>
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
                    <input
                      className="form-control"
                      //defaultValue={times.start}
                      onChange={this.handleStartTimeInput}
                    />
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
                    <input
                      className="form-control"
                      //defaultValue={times.end}
                      onChange={this.handleEndTimeInput}
                    />
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
                  <button className="btn btn-lg tutorBtn">Cancel</button>
                </div>
              ) : (
                <div>
                  <button
                    className="btn btn-lg tutorBtn"
                    onClick={this.handleAddNewTimeSlot}
                  >
                    Add New Time
                  </button>
                  {this.state.updateBtnState ? (
                    <button
                      className="btn btn-lg tutorBtn"
                      //onClick={this.updateTutorInfo}
                    >
                      Update tutor
                    </button>
                  ) : (
                    <button className="btn btn-lg tutorBtn" disabled>
                      Update tutor
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
  render() {
    return <div className="container">{this.renderPeerCategories()}</div>;
  }
}
export default AdminPeerCatRender;
