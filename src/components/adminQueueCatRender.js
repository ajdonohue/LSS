import React, { Component } from "react";
import PouchDB from "pouchdb";
import Modal from "react-bootstrap/Modal";

// --- PROPS ---
// showEdit: handleEditVisability()
// showDeletePopup: handleDeletePopupVisability()
// descriptionInput: handleDesciptionInput()
// qLengthInput: handleqLengthInput()
// updateBtnState: handleqLengthInput()
// --- PROPS ---

class AdminQueueCatRender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEdit: false,
      showDeletePopup: false,
      descriptionInput: this.props.description,
      qLengthInput: this.props.qLength,
      updateBtnState: false,
    };
  }

  handleDeletePopupVisability = () => {
    this.setState({ showDeletePopup: !this.state.showDeletePopup });
  };

  handleDesciptionInput = (e) => {
    this.setState({ descriptionInput: e.target.value, updateBtnState: true });
  };

  handleqLengthInput = (e) => {
    this.setState({
      qLengthInput: parseInt(e.target.value, 10),
      updateBtnState: true,
    });
  };

  handleEditVisability = () => {
    this.setState({ showEdit: !this.state.showEdit });
  };

  updateQueueCat = () => {
    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
    );
    console.log(this.state.descriptionInput);
    let t = this;
    db.get(this.props.id)
      .then(function (doc) {
        if (
          t.state.descriptionInput !== t.props.description &&
          t.state.descriptionInput.trim() !== ""
        ) {
          doc.desc = t.state.descriptionInput;
        }
        if (t.state.qLengthInput !== t.props.qLength) {
          doc.qLength = t.state.qLengthInput;
        }
        console.log(doc.desc);
        t.setState({ updateBtnState: false });
        return db.put(doc);
      })
      .then(() => {
        return db.get(t.props.id);
      })
      .catch(function (err) {
        console.log(err);
      });
    this.handleEditVisability();
  };

  handleDeleteQueueCat = () => {
    let db = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
    );

    db.get(this.props.id, function err(err, doc) {
      if (err) {
        return console.log(err);
      }
      db.remove(doc, function err(response) {
        if (err) {
          return console.log(err);
        }
      });
    });
    this.handleDeletePopupVisability();
  };

  renderQueueCategories = () => {
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
              <h3>Department: {this.props.id}</h3>
            </div>

            <div className="row d-flex justify-content-around">
              <button
                className="btn btn-lg tutorBtn"
                onClick={this.handleEditVisability}
              >
                Edit
              </button>
              <button
                className="btn btn-lg tutorBtn justify-content-end"
                onClick={this.handleDeletePopupVisability}
              >
                Delete
              </button>
            </div>
            <Modal show={this.state.showDeletePopup}>
              <Modal.Header>
                <Modal.Title>Warning</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                Are you sure you want to delete {this.props.id} once deleted it
                cannot be reversed!
              </Modal.Body>
              <Modal.Footer>
                {" "}
                <button
                  onClick={this.handleDeletePopupVisability}
                  className="btn btn-secondary"
                >
                  No
                </button>{" "}
                <button
                  onClick={this.handleDeleteQueueCat}
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
            <div>
              <div
                className={
                  this.props.rowType
                    ? "row d-flex trueEditRow"
                    : "row d-flex falseEditRow"
                }
              >
                <div className="col-6 text-center">
                  <h4>Description</h4>
                </div>
                <div className="col-6 text-center">
                  <input
                    className="form-control"
                    defaultValue={this.state.descriptionInput}
                    onChange={this.handleDesciptionInput}
                  ></input>
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
                  <h4>Length of Appointments</h4>
                </div>
                <div className="col-6 text-center">
                  <input
                    className="form-control"
                    defaultValue={this.state.qLengthInput}
                    onChange={this.handleqLengthInput}
                  ></input>
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
              {this.state.updateBtnState ? (
                <div>
                  <button
                    className="btn btn-lg tutorBtn"
                    onClick={this.updateQueueCat}
                  >
                    Update
                  </button>
                </div>
              ) : (
                <div>
                  <button className="btn btn-lg tutorBtn" disabled>
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  render() {
    return <>{this.renderQueueCategories()}</>;
  }
}
export default AdminQueueCatRender;
