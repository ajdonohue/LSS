import React, { Component } from "react";
import { Link } from "react-router-dom";
import PouchDB from "pouchdb";

class StudentValidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailInput: "",
      sIDInput: "",
      phoneInput: "",
      programInput: "Writing",
      emailValidated: true,
      sIDValidated: true,
      phoneValidated: true,
      scene: 0,
    };
  }

  componentDidMount = () => {
    let s = sessionStorage.getItem("studentID");
    //if (s) this.props.history.push("/categories");
  };

  handleEmail = (e) => {
    this.setState({ emailInput: e.target.value });
  };

  validateEmail = () => {
    //let re = new RegExp("[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}");
    let re = new RegExp("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@+(mybvc.ca)*$", "i");
    if (re.test(this.state.emailInput) === false) {
      this.setState({ emailValidated: false });
    } else this.setState({ emailValidated: true });
  };

  validateSID = () => {
    // let re = new RegExp("^[0-9]{6}$");
    // if (re.test(this.state.sIDInput) === false) {
    //   this.setState({ sIDValidated: false });
    // } else this.setState({ sIDValidated: true });
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
    //let docExists = true;
    let studentObj = {
      _id: this.state.sIDInput,
      programID: this.state.programInput,
      phone: this.state.phoneInput,
      email: this.state.emailInput,
      notes: [],
      totalAppointments: 0,
      noShows: 0,
    };

    db.put(studentObj).catch(function (err) {
      console.log(err);
    });


    let x = this;

    if (typeof x.props.addStudentToPeer === 'function'){
      let peerobj = {
        _id: (this.state.sIDInput+"/"+this.props.date),
        student_id: this.state.sIDInput,
        date: this.props.date,
        programID: this.props.peerCategorie,
        time: this.props.time,
      };
      x.props.addStudentToPeer(peerobj);
      x.props.addStudentToQueue(peerobj.student_id);
    } else {
      sessionStorage.setItem("studentID", x.state.sIDInput);
      x.props.history.push("/categories");
    }

    // db.get(this.state.sIDInput)
    //   .catch(function(err) {
    //     if (err.status === 404) docExists = false;
    //   })
    //   .then(() => {
    //     if (!docExists) {
    //       db.put(studentObj).catch(function(err) {
    //         console.log(err);
    //       });
    //     }
    //   });
  };

  checkStudent = () => {
    if (this.state.sIDInput.length === 0 || this.state.sIDInput.length < 6) {
      alert("Invalid ID");
      return;
    }

    let peerobj = {
      _id: (this.state.sIDInput+"/"+this.props.date),
      student_id: this.state.sIDInput,
      date: this.props.date,
      programID: this.props.peerCategorie,
      time: this.props.time,
    };

    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/students"
    );
    let x = this;
    db.get(this.state.sIDInput)
      .then(function (doc) {
        if (doc) {
          if (typeof x.props.addStudentToPeer === 'function'){
            x.props.addStudentToPeer(peerobj);
            x.props.addStudentToQueue(peerobj.student_id);
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
      <div>
        <h1 className="validateLead">Enter Your Student ID</h1>
        <div className="validateContainer">
          <form className="validateForm">
            <div className="form-group">
              <div className="form-group">
                <label htmlFor="validID">Student ID</label>
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
              className="btn btn-lg btn-dark"
              onClick={this.checkStudent}
            >
              Go
            </button>
          </form>
        </div>
      </div>
    );
  };

  firstTimeStudent = () => {
    return (
      <div>
        <h1 className="validateLead">Enter Student Information</h1>
        <div className="validateContainer">
          <form className="validateForm">
            <div className="form-group">
              <label for="validEmail">BVC Email address</label>
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
                    ? "hideEmailVerified card-body"
                    : "showEmailVerified card-body"
                }
              >
                Invalid Email!
              </div>
            </div>
            <div className="form-group">
              <label for="validID">Student ID</label>
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
                    ? "hideSIDVerified card-body"
                    : "showSIDVerified card-body"
                }
              >
                Invalid StudentID!
              </div>
            </div>
            <div className="form-group">
              <label for="validPhone">Phone Number</label>
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
                    ? "hidePhoneVerified card-body"
                    : "showPhoneVerified card-body"
                }
              >
                Invalid Phone Number!
              </div>
            </div>
            <div className="form-group text-center">
              <label for="validProgram">Tutoring Need</label>
              <select
                className="form-control text-center"
                id="validProgram"
                onChange={this.handleProgram}
                value={this.state.programInput}
              >
                <option value="Writing">Writing</option>
                <option value="Learning Coach">Learning Coach</option>
                <option value="Health and Wellness">Health and Wellness</option>
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
                  this.state.emailInput !== "" &&
                  this.state.sIDInput !== "" &&
                  this.state.phoneInput !== ""
                    ? "showCatBtn"
                    : "hideCatBtn"
                }
              >
                  <button
                    className="btn btn-lg btn-dark homeBtn"
                    onClick={this.handleStudent}
                  >
                    Get Tutoring
                  </button>
              </div>
            </div>
          </form>
        </div>
      </div>
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
