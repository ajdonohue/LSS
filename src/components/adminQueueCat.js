import React, { Component } from "react";
import PouchDB from "pouchdb";
import "../css/adminTutor.css";
import AdminQueueCatRender from "./adminQueueCatRender";

// --- PROPS ---
// currentQueueCat: fetchQueueCat()
// departmentInput: handleDepNameInput()
// descriptionInput: handleDescInput()
// qLengthInput: handleQLengthinput()
// showAdd: componentDidMount(), handleAddVisability()
// addBtnState: handleDepNameInput(), handleDescInput(), handleQLengthinput()
// --- PROPS ---

class AdminQueueCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQueueCat: [],
      departmentInput: "",
      descriptionInput: "",
      qLengthInput: "",
      showAdd: false,
      addBtnState: false,
    };
  }

  componentDidMount = async () => {
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
    );

    tDB
      .changes({ since: "now", live: true, include_docs: true })
      .on("change", () => {
        this.fetchQueueCat();
      });

    await this.fetchQueueCat();
  };

  handleAddVisability = () => {
    this.setState({ showAdd: !this.state.showAdd });
  };

  handleDepNameInput = (e) => {
    this.setState({ addBtnState: true, departmentInput: e.target.value });
  };

  handleDescInput = (e) => {
    this.setState({ addBtnState: true, descriptionInput: e.target.value });
  };

  handleQLengthinput = (e) => {
    this.setState({
      addBtnState: true,
      qLengthInput: parseInt(e.target.value, 10),
    });
  };

  fetchQueueCat = async () => {
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
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
    await this.setState({ currentQueueCat: tResult });
  };

  isOdd = (n) => {
    if (n % 2 === 0) return true;
    else return false;
  };

  handleQueueCatAdd = () => {
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
    );

    let queueCatObj = {
      _id: this.state.departmentInput,
      desc: this.state.descriptionInput,
      currentQ: 0,
      ETA: 0,
      qLength: this.state.qLengthInput,
      activeQ: [],
    };

    tDB.put(queueCatObj).catch(function (err) {
      console.log(err);
    });
    this.handleAddVisability();
  };

  renderAddQueueCat = () => {
    return (
      <>
        <div>
          <div className="col">
            <div className="row d-flex justify-content-around">
              <button
                className="btn btn-lg tutorBtn"
                onClick={this.handleAddVisability}
              >
                Add New Department
              </button>
            </div>
          </div>
        </div>
        <div className={this.state.showAdd ? "showEdit" : "hideEdit"}>
          <div className="container">
            <div className="row d-flex falseEditRow">
              <div className="col-12 text-center">
                <h3>New Department</h3>
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Department Name</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handleDepNameInput}
                />
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Description</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handleDescInput}
                />
              </div>
            </div>
            <div className="row d-flex falseEditRow">
              <div className="col-6 text-center">
                <h4>Appointment Length</h4>
              </div>
              <div className="col-6 text-center">
                <input
                  className="form-control"
                  onInput={this.handleQLengthinput}
                />
              </div>
            </div>
            <div className="row d-flex justify-content-center falseEditRow">
              {this.state.departmentInput !== "" &&
              this.state.descriptionInput !== "" &&
              this.state.qLengthInput !== "" ? (
                <button
                  className="btn btn-lg tutorBtn"
                  onClick={this.handleQueueCatAdd}
                >
                  Add Department
                </button>
              ) : (
                <button className="btn btn-lg tutorBtn" disabled>
                  Add Department
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  renderQueueCat = () => {
    let counter = 0;
    return this.state.currentQueueCat.map((e) => (
      <AdminQueueCatRender
        rowType={this.isOdd(counter++)}
        id={e.doc._id}
        qLength={e.doc.qLength}
        description={e.doc.desc}
      />
    ));
  };

  render() {
    return (
      <>
        {this.renderAddQueueCat()}
        {this.renderQueueCat()}
      </>
    );
  }
}
export default AdminQueueCat;
