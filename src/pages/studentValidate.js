import React, { Component } from "react";
import PouchDB from "pouchdb";
import "../css/studentValidate.css";


//
//Props -
//
//emailInput: the user input email
//sIDInput: user input student id
//phoneInput: user input phone number
//fname: user input first name
//lname: user input last name
//programInput: writting set to default input, holds selected input
//emailValidated: set to true if email is valid
//sIDValidated: set to true if the ID is valid
//phoneValidated: set to true if the phone is valid
//scene: sets scene

class StudentValidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
      sIDInput: "",
      phoneInput: "",
      fName: "",
      lName: "",
      programInput: "Writing",
      emailValidated: true,
      sIDValidated: true,
      phoneValidated: true,
      scene: 0,
    };
  }

  handleEmail = (e) => {
    this.setState({ emailInput: e.target.value });
  };

  validateEmail = () => {
    let re = new RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@+(mybvc.ca)*$", "i");
    if (re.test(this.state.emailInput) === false) {
      this.setState({ emailValidated: false });
    } else this.setState({ emailValidated: true });
  };

  cleanPhone = async () => {
    let fixedNumber = null;

    if (this.state.phoneInput.length === 13) {
      if (
        this.state.phoneInput.charAt(0) === "(" &&
        this.state.phoneInput.charAt(4) === ")" &&
        this.state.phoneInput.charAt(8) === "-"
      ) {
        fixedNumber =
          this.state.phoneInput.substring(1, 4) +
          this.state.phoneInput.substring(5, 8) +
          this.state.phoneInput.substring(9);
        return fixedNumber;
      }
    }
  };

  validatePhone = async () => {
    let re = new RegExp("^[0-9]*$");
    //let re = new RegExp("^[0-9]{6}$");

    let cleanedNumber = await this.cleanPhone();
    if (this.state.phoneInput.length === 13)
      this.setState({ phoneInput: cleanedNumber });

    if (
      re.test(this.state.phoneInput) === false ||
      this.state.phoneInput.length !== 10
    ) {
      this.setState({ phoneValidated: false });
    } else this.setState({ phoneValidated: true });
  };

  handleSID = (e) => {
    this.setState({ sIDInput: e.target.value });
  };

  handleFName = (e) => {
    this.setState({ fName: e.target.value });
  };

  handleLName = (e) => {
    this.setState({ lName: e.target.value });
  };

  handlePhone = (e) => {
    this.setState({ phoneInput: e.target.value });
  };

  handleProgram = (e) => {
    this.setState({ programInput: e.target.value });
  };

  //check if student exists in database, if not add and set ID to sessionStorage,
  //if exists, just set sessionStorage
  //works rn but for bad reasons, just errors out if ID exists, need better implementation
  handleStudent = () => {
    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/students"
    );

    sessionStorage.setItem("studentID", this.state.sIDInput);
    let x = this;

    let now = new Date();

    if (typeof x.props.addStudentToPeer === "function") {
      let peerobj = {
        _id: now.getTime().toString(),
        studentId: this.state.sIDInput,
        date: this.props.date,
        programID: this.props.peerCategorie,
        time: now.toLocaleTimeString(),
      };
      x.props.addStudentToPeer(peerobj);
      x.props.addStudentToQueue(peerobj.studentId);

      let studentObj = {
        _id: this.state.sIDInput,
        programID: this.state.programInput,
        fName: this.state.fName,
        lName: this.state.lName,
        phone: this.state.phoneInput,
        email: this.state.emailInput,
        notes: [],
        totalAppointments: 0,
        noShows: 0,
      };

      db.put(studentObj).catch(function (err) {
        console.log(err);
      });
    } else {
      sessionStorage.setItem("studentID", x.state.sIDInput);
      let studentObj = {
        _id: this.state.sIDInput,
        programID: this.state.programInput,
        fName: this.state.fName,
        lName: this.state.lName,
        phone: this.state.phoneInput,
        email: this.state.emailInput,
        notes: [],
        totalAppointments: 0,
        noShows: 0,
      };

      db.put(studentObj).catch(function (err) {
        console.log(err);
      });
      x.props.history.push("/categories");
    }
  };

  checkStudent = () => {
    if (this.state.sIDInput.length === 0 || this.state.sIDInput.length < 6) {
      alert("Invalid ID");
      return;
    }

    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/students"
    );
    let x = this;
    let now = new Date();
    let peerobj = {
      _id: now.getTime().toString(),
      studentId: this.state.sIDInput,
      date: this.props.date,
      programID: this.props.peerCategorie,
      time: now.toLocaleTimeString(),
    };
    db.get(this.state.sIDInput)
      .then(function (doc) {
        if (doc) {
          if (typeof x.props.addStudentToPeer === "function") {
            x.props.addStudentToPeer(peerobj);
            x.props.addStudentToQueue(peerobj.studentId);
          } else {
            sessionStorage.setItem("studentID", x.state.sIDInput);
            x.props.history.push("/categories");
          }
        }
      })
      .catch(function (err) {
        if (err.status === 404) {
          x.setState({ scene: 1 });
        }
      });
  };

  checkSID = () => {
    return (
      <>
        <div className="row">
          <h1 className="validateLead">Enter Your Student ID</h1>
        </div>
        <div className="row">
          <div className="validateContainer">
            <form className="validateForm">
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor="validID">
                    <h3>Student ID</h3>
                  </label>
                  <input
                    className="form-control"
                    id="validID"
                    onInput={this.handleSID}
                    onBlur={this.validateSID}
                  />
                  <div
                    className={
                      this.state.sIDValidated
                        ? "hideSIDVerified card-body"
                        : "showSIDVerified card-body"
                    }
                  >
                    Invalid StudentID!
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn btn-lg bookBtn"
                onClick={this.checkStudent}
              >
                Go!
              </button>
            </form>
          </div>
        </div>
      </>
    );
  };

  firstTimeStudent = () => {
    return (
      <>
        <div className="row">
          <h1 className="validateLead">Enter Student Information</h1>
        </div>
        <div className="row">
          <div className="validateContainer">
            <form className="validateForm">
              <div className="form-group d-flex flex-column justify-content-center">
                <label for="validEmail">
                  <h3>BVC Email address</h3>
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="validEmail"
                  aria-describedby="emailHelp"
                  onInput={this.handleEmail}
                  onBlur={this.validateEmail}
                />
                <div
                  className={
                    this.state.emailValidated
                      ? "hideVerified card-body"
                      : "showUnVerified card-body"
                  }
                >
                  Invalid Email!
                </div>
              </div>
              <div className="form-group">
                <label for="validID">
                  <h3>Student ID</h3>
                </label>
                <input
                  className="form-control"
                  id="validID"
                  onInput={this.handleSID}
                  onBlur={this.validateSID}
                  value={this.state.sIDInput}
                />
                <div
                  className={
                    this.state.sIDValidated
                      ? "hideVerified card-body"
                      : "showUnVerified card-body"
                  }
                >
                  Invalid StudentID!
                </div>
              </div>
              <div className="form-group">
                <label for="validPhone">
                  <h3>First Name</h3>
                </label>
                <input
                  className="form-control"
                  id="validPhone"
                  onInput={this.handleFName}
                  maxLength="13"
                />
              </div>
              <div className="form-group">
                <label for="validPhone">
                  <h3>Last Name</h3>
                </label>
                <input
                  className="form-control"
                  id="validPhone"
                  onInput={this.handleLName}
                  maxLength="13"
                />
              </div>
              <div className="form-group">
                <label for="validPhone">
                  <h3>Phone Number</h3>
                </label>
                <input
                  className="form-control"
                  id="validPhone"
                  onInput={this.handlePhone}
                  onBlur={this.validatePhone}
                  maxLength="13"
                />
                <div
                  className={
                    this.state.phoneValidated
                      ? "hideVerified card-body"
                      : "showUnVerified card-body"
                  }
                >
                  Invalid Phone Number!
                </div>
              </div>
              <div className="form-group text-center">
                <label for="validProgram">
                  <h3>Tutoring Need</h3>
                </label>
                <select
                  className="form-control text-center"
                  id="validProgram"
                  onChange={this.handleProgram}
                  value={this.state.programInput}
                >
                  <option value="Writing">Writing</option>
                  <option value="Learning Coach">Learning Coach</option>
                  <option value="Health and Wellness">
                    Health and Wellness
                  </option>
                  <option value="Creative Technologies">
                    Creative Technologies
                  </option>
                </select>
              </div>
              <div className="form-group validateBtn">
                <div
                  className={
                    this.state.sIDValidated &&
                    this.state.emailValidated &&
                    this.state.phoneValidated &&
                    this.state.fName.length > 2 &&
                    this.state.lName.length > 2 &&
                    this.state.emailInput !== "" &&
                    this.state.sIDInput !== "" &&
                    this.state.phoneInput !== ""
                      ? "showCatBtn"
                      : "hideCatBtn"
                  }
                >
                  <button
                    className="btn btn-lg bookBtn"
                    onClick={this.handleStudent}
                  >
                    Get Tutoring!
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  };

  renderScene = () => {
    let s = this.state.scene;

    if (s === 0) return this.checkSID();
    else if (s === 1) return this.firstTimeStudent();
    else return <h1>Oops</h1>;
  };

  render() {
    return <div className="container">{this.renderScene()}</div>;
  }
}

export default StudentValidate;
