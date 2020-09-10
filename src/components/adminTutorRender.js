import React, { Component } from "react";
import PouchDB from "pouchdb";
import Modal from "react-bootstrap/Modal";
import bodyParser from "body-parser";

//
// Props -
//
// rowType: true or false, determines style for row
// id: id of the tutor in the row
// pass: tutor's password
// programID: tutor's program
// phone: tutor's phone
// email: email of the tutor in the row
// address: tutor's street address
// city: tutor's city
// province: tutor's province
// role: tutor's role
//

// ----- TODO ------
// Functionality on delete to remove tutor from db - should have a warning step
// Force a rerender on a successful update of tutor DB
// (Not a 100% needed, but would be nice. Might have to be done in AdminTutors)
//
// if we want id to be updated everytime we nned to add more functionality
class AdminTutorRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEdit: false,
      passInput: this.props.pass,
      progInput: this.props.programID,
      phoneInput: this.props.phone,
      emailInput: this.props.email,
      addressInput: this.props.address,
      cityInput: this.props.city,
      provinceInput: this.props.province,
      roleInput: this.props.role,
      fNameInput: this.props.fName,
      lNameInput: this.props.lName,
      updateBtnState: false,
      phoneValidated: true,
      emailValidated: true,
      showDeletePopup: false,
    };
  }

  componentDidMount = async () => {
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
    );

    tDB
      .changes({ since: "now", live: true, include_docs: true })
      .on("change", () => {
        this.renderTutor();
        console.log("TUTOR DB UPDATED");
      });
    //await this.fetchPeerTutoring();
    // this.generatePrograms();
  };

  handleEditVisibility = () => {
    this.setState({ showEdit: !this.state.showEdit });
  };

  handlePassInput = (e) => {
    this.setState({ passInput: e.target.value, updateBtnState: true });
  };

  handleFNameInput = (e) => {
    this.setState({ fNameInput: e.target.value, updateBtnState: true });
  };

  handleLNameInput = (e) => {
    this.setState({ lNameInput: e.target.value, updateBtnState: true });
  };

  handleProgInput = (e) => {
    this.setState({ progInput: e.target.value, updateBtnState: true });
  };

  handlePhoneInput = (e) => {
    this.setState({ phoneInput: e.target.value });
  };

  showDeletePopupVisability = () => {
    this.setState({ showDeletePopup: true });
  };

  hideDeletePopupVisabilty = () => {
    this.setState({ showDeletePopup: false });
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
      this.setState({ phoneValidated: false, updateBtnState: false });
    } else this.setState({ phoneValidated: true, updateBtnState: true });
  };

  handleAddressInput = (e) => {
    this.setState({ addressInput: e.target.value, updateBtnState: true });
  };

  handleCityInput = (e) => {
    this.setState({ cityInput: e.target.value, updateBtnState: true });
  };

  handleProvinceInput = (e) => {
    this.setState({ provinceInput: e.target.value, updateBtnState: true });
  };

  handleRoleInput = (e) => {
    this.setState({ roleInput: e.target.value, updateBtnState: true });
  };

  handleDeleteTutor = () => {
    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
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
    // have to fix id logic in order to grab id
  };

  // generatePrograms = () => {
  //   let array = this.fetchPrograms();
  //   console.log(array);
  //   if (array !== null) {
  //     //return array.map((e) => <option value={e.id}>{e.id}</option>);
  //   }
  // };

  // fetchPrograms = async () => {
  //   let pDB = new PouchDB(
  //     "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
  //   );

  //   pDB
  //     .allDocs(
  //       {
  //         include_docs: true,
  //         attachments: false,
  //       },
  //       function err(response) {
  //         if (err) {
  //           return console.log(err);
  //         }
  //       }
  //     )
  //     .then(function (result) {
  //       console.log(result);
  //       return result.rows.map((e) => <option value={e.id}>{e.id}</option>);
  //     });
  //   // let pPromise = new Promise((resolve, reject) => {
  //   //   ptDB
  //   //     .allDocs({
  //   //       include_docs: true,
  //   //       attachments: false,
  //   //     })
  //   //     .then(function (docs) {
  //   //       resolve(docs.rows);
  //   //     })
  //   //     .catch(function (err) {
  //   //       reject(console.log(err));
  //   //     });
  //   // });

  //   // let pResult = await pPromise;
  //   // console.log(pResult.id);
  //   // return pResult;
  // };
  generatePrograms = () => {
    let array = this.props.programArray;
    if (array) {
      return array.map((e) => <option value={e.id}>{e.id}</option>);
    }
  };

  // fetchPeerTutoring = async () => {
  //   let pDB = new PouchDB(
  //     "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
  //   );

  //   let pPromise = new Promise((resolve, reject) => {
  //     pDB
  //       .allDocs({
  //         include_docs: true,
  //         attachments: true,
  //       })
  //       .then(function (docs) {
  //         resolve(docs.rows);
  //       });
  //   });

  //   let pResult = await pPromise;
  //   await this.setState({ programArray: pResult });
  // };

  // getProgramArray = async (data) => {
  //   console.log(data);
  //   await this.fetchPeerTutoring();
  //   this.setState({ programArray: data });
  // };

  renderTutor = () => {
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
            <div className="row d-flex justify-content-center">
              <h3>
                Tutor: {this.props.fName} {this.props.lName}
              </h3>
            </div>
            <div className="row d-flex justify-content-around">
              <button
                className="btn btn-lg tutorBtn"
                onClick={this.handleEditVisibility}
              >
                Edit tutor
              </button>
              <button
                className="btn btn-lg tutorBtn"
                onClick={this.showDeletePopupVisability}
              >
                Delete tutor
              </button>
            </div>
            <Modal show={this.state.showDeletePopup}>
              <Modal.Header>
                <Modal.Title>Warning</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete {this.props.fName}{" "}
                {this.props.lName} once deleted it cannot be reversed!
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
                  onClick={this.handleDeleteTutor}
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
            <div
              className={
                this.props.rowType
                  ? "row d-flex trueEditRow"
                  : "row d-flex falseEditRow"
              }
            >
              <div className="col-6 text-center">
                <h4>Password</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  defaultValue={this.state.passInput}
                  onChange={this.handlePassInput}
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
                <h4>First Name</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  defaultValue={this.state.fNameInput}
                  onChange={this.handleFNameInput}
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
                <h4>Last Name</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  defaultValue={this.state.lNameInput}
                  onChange={this.handleLNameInput}
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
                <h4>Program ID</h4>
              </div>
              <div className="col-6 text-center">
                <select
                  value={this.state.progInput}
                  onChange={this.handleProgInput}
                >
                  {this.generatePrograms()}
                </select>
                {/* <input
                  className="form-control"
                  defaultValue={this.state.progInput}
                  onChange={this.handleProgInput}
                /> */}
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
                <h4>Phone Number</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  defaultValue={this.state.phoneInput}
                  onChange={this.handlePhoneInput}
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
            <div
              className={
                this.props.rowType
                  ? "row d-flex trueEditRow"
                  : "row d-flex falseEditRow"
              }
            >
              <div className="col-6 text-center">
                <h4>Street Address</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  defaultValue={this.state.addressInput}
                  onChange={this.handleAddressInput}
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
                <h4>City</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  defaultValue={this.state.cityInput}
                  onChange={this.handleCityInput}
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
                <h4>Province</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  defaultValue={this.state.provinceInput}
                  onChange={this.handleProvinceInput}
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
                <h4>Role</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  defaultValue={this.state.roleInput}
                  onChange={this.handleRoleInput}
                />
              </div>
            </div>
            <div
              className={
                this.props.rowType
                  ? "row d-flex justify-content-center trueEditRow"
                  : "row d-flex justify-content-center falseEditRow"
              }
            >
              {this.state.updateBtnState ? (
                <button
                  className="btn btn-lg tutorBtn"
                  onClick={this.updateTutorInfo}
                >
                  Update tutor
                </button>
              ) : (
                <button className="btn btn-lg tutorBtn" disabled>
                  Update tutor
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  updateTutorInfo = () => {
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
    );

    let t = this;
    tDB
      .get(this.props.id)
      .then(function (doc) {
        if (
          t.state.passInput !== t.props.pass &&
          t.state.passInput.trim() !== ""
        ) {
          doc.password = t.state.passInput;
        }

        if (
          t.state.progInput !== t.props.programID &&
          t.state.progInput.trim() !== ""
        ) {
          doc.programID = t.state.progInput;
        }

        if (
          t.state.phoneInput !== t.props.phone &&
          t.state.phoneInput.trim() !== ""
        ) {
          doc.phoneNumber = t.state.phoneInput;
        }

        // Since ID runs off email, need proper validation first
        // Will have to update ._id here to whatever comes before
        // @ in email

        // if (
        //   t.state.emailInput !== t.props.email &&
        //   t.state.emailInput.trim() !== ""
        // ) {
        //   doc._id = t.state.emailInput.split("@")[0];
        //   console.log(doc._id);
        //   doc.email = t.state.emailInput;
        // }

        if (
          t.state.addressInput !== t.props.address &&
          t.state.addressInput.trim() !== ""
        ) {
          doc.streetAddress = t.state.addressInput;
        }

        if (
          t.state.cityInput !== t.props.city &&
          t.state.cityInput.trim() !== ""
        ) {
          doc.city = t.state.cityInput;
        }

        if (
          t.state.provinceInput !== t.props.province &&
          t.state.provinceInput.trim() !== ""
        ) {
          doc.province = t.state.provinceInput;
        }

        if (
          t.state.roleInput !== t.props.role &&
          t.state.roleInput.trim() !== ""
        ) {
          doc.role = t.state.roleInput;
        }
        t.setState({ updateBtnState: false });
        return tDB.put(doc);
      })
      .then(() => {
        return tDB.get(t.props.id);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  checkUpdateTutorButton = () => {
    if (
      this.state.passInput === this.props.pass &&
      this.state.progInput === this.props.programID &&
      this.state.phoneInput === this.props.phone &&
      this.state.addressInput === this.props.address &&
      this.state.cityInput === this.props.city &&
      this.state.provinceInput === this.props.province &&
      this.state.roleInput === this.props.role
    )
      return false;
    else return true;
  };

  render() {
    return <div className="container">{this.renderTutor()}</div>;
  }
}

export default AdminTutorRender;
