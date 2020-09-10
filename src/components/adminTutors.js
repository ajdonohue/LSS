import React, { Component } from "react";
import PouchDB from "pouchdb";
import "../css/adminTutor.css";
import AdminTutorRender from "./adminTutorRender";

// ----- TODO -----
// Add Tutor btn to add a new tutor to db
// Will need to rerender so new tutor shows up without refresh
//

class AdminTutors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTutors: [],
      passInput: "",
      progInput: "",
      phoneInput: "",
      emailInput: "",
      addressInput: "",
      cityInput: "",
      provinceInput: "",
      roleInput: "",
      fNameInput: "",
      lNameInput: "",
      tutorId: "",
      showAdd: false,
      addBtnState: false,
      phoneValidated: true,
      emailValidated: true,
      programArray: null,
    };
  }

  componentDidMount = async () => {
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
    );

    tDB
      .changes({ since: "now", live: true, include_docs: true })
      .on("change", () => {
        this.fetchTutors();
      });

    await this.fetchTutors();
    await this.fetchPeerTutoring();
  };

  handleUpdates = async () => {
    await this.fetchTutors;
    this.renderTutors();
  };

  handleAddVisibility = () => {
    this.setState({ showAdd: !this.state.showAdd });
  };

  fetchTutors = async () => {
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
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
    await this.setState({ currentTutors: tResult });
  };

  isOdd = (n) => {
    if (n % 2 === 0) return true;
    else return false;
  };

  renderTutors = () => {
    let filteredTutors = this.state.currentTutors.filter(
      (e) => e.doc.role !== "Admin"
    );
    let counter = 0;

    return filteredTutors.map((e) => (
      <AdminTutorRender
        rowType={this.isOdd(counter++)}
        programArray={this.state.programArray}
        id={e.doc._id}
        fName={e.doc.firstName}
        lName={e.doc.lastName}
        pass={e.doc.password}
        programID={e.doc.programID}
        phone={e.doc.phoneNumber}
        email={e.doc.email}
        address={e.doc.streetAddress}
        city={e.doc.city}
        province={e.doc.province}
        role={e.doc.role}
      />
    ));
  };

  handlePassInput = (e) => {
    this.setState({ passInput: e.target.value, addBtnState: true });
  };

  handleProgInput = (e) => {
    this.setState({ progInput: e.target.value, addBtnState: true });
  };

  handlePhoneInput = (e) => {
    this.setState({ phoneInput: e.target.value, addBtnState: true });
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
      this.setState({ phoneValidated: false, addBtnState: false });
    } else this.setState({ phoneValidated: true, addBtnState: true });
  };

  handleAddressInput = (e) => {
    this.setState({ addressInput: e.target.value, addBtnState: true });
  };

  handleCityInput = (e) => {
    this.setState({ cityInput: e.target.value, addBtnState: true });
  };

  handleProvinceInput = (e) => {
    this.setState({ provinceInput: e.target.value, addBtnState: true });
  };

  handleRoleInput = (e) => {
    this.setState({ roleInput: e.target.value, addBtnState: true });
  };

  handleFNameInput = (e) => {
    this.setState({ fNameInput: e.target.value, addBtnState: true });
  };
  handleLNameInput = (e) => {
    this.setState({ lNameInput: e.target.value, addBtnState: true });
  };

  handleTutor = () => {
    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
    );

    let s = this.state.emailInput.search("@");
    let tID = this.state.emailInput.substr(0, s);
    let tutorObj = {
      _id: tID,
      password: this.state.passInput,
      firstName: this.state.fNameInput,
      lastName: this.state.lNameInput,
      programID: this.state.progInput,
      phoneNumber: this.state.phoneInput,
      email: this.state.emailInput,
      streetAddress: this.state.addressInput,
      city: this.state.cityInput,
      province: this.state.provinceInput,
      role: this.state.roleInput,
      isLoggedIn: false,
      activeAppointment: {},
    };
    console.log(tutorObj);
    db.put(tutorObj).catch(function (err) {
      console.log(err);
    });

    this.handleAddVisibility();
  };
  generatePrograms = () => {
    let array = this.state.programArray;

    if (array !== null) {
      return array.map((e) => <option value={e.id}>{e.id}</option>);
    }
  };

  fetchPeerTutoring = async () => {
    let pDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
    );

    let pPromise = new Promise((resolve, reject) => {
      pDB
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

    let pResult = await pPromise;
    await this.setState({ programArray: pResult });
  };
  handleEmailInput = (e) => {
    this.setState({ emailInput: e.target.value });
  };
  renderAddTutor = () => {
    return (
      <>
        <div>
          <div className="col">
            <div className="row d-flex justify-content-around">
              <button
                className="btn btn-lg tutorBtn"
                onClick={this.handleAddVisibility}
              >
                Add New Tutor
              </button>
            </div>
          </div>
        </div>
        <div className={this.state.showAdd ? "showEdit" : "hideEdit"}>
          <div className="container">
            <div className="row d-flex falseEditRow">
              <div className="col-12 text-center">
                <h3>New Tutor</h3>
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>First Name</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handleFNameInput}
                />
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Last Name</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handleLNameInput}
                />
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Password</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handlePassInput}
                />
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Program ID</h4>
              </div>
              <div className="col-6 text-center">
                <select className="form-control">
                  {this.generatePrograms()}
                </select>
                {/* <input
                  className="form-control"
                  onInput={this.handleProgInput}
                /> */}
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Phone Number</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handlePhoneInput}
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
            </div>
            {/* <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Email</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handleEmailInput}
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
            </div> */}
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Street Address</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handleAddressInput}
                />
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>City</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handleCityInput}
                />
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Province</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handleProvinceInput}
                />
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Role</h4>
              </div>
              <div className="col-6 text-center">
                <select
                  className="form-control"
                  onChange={this.handleRoleInput}
                  defaultValue="Tutor"
                >
                  <option value="Tutor">Tutor</option>
                  <option value="Admin">Admin</option>
                  <option value="Appointment">Appointment</option>
                </select>
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Email</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handleEmailInput}
                />
              </div>
            </div>
            <div className="row d-flex justify-content-center falseEditRow">
              {this.state.phoneValidated &&
              this.state.fNameInput !== "" &&
              this.state.lNameInput !== "" &&
              this.state.passInput !== "" &&
              this.state.streetAddress !== null &&
              this.state.cityInput !== "" &&
              this.state.provinceInput !== "" &&
              this.state.roleInput !== "" ? (
                <button
                  className="btn btn-lg tutorBtn"
                  onClick={this.handleTutor}
                >
                  Add Tutor
                </button>
              ) : (
                <button className="btn btn-lg tutorBtn" disabled>
                  Add Tutor
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  render() {
    return (
      <>
        {this.renderAddTutor()}
        {this.renderTutors()}
      </>
    );
  }
}

export default AdminTutors;
