import React, { Component } from "react";
import { observer } from "mobx-react";
import PouchDB from "pouchdb";
import "../css/qNote.css";

//
// QNote -
// Renders each note object attached to the student database (in note array)
//
// Props -
// sID: Student ID to obtain notes for
//

const qNote = observer(
  class QNote extends Component {
    _isMounted = false;
    constructor(props) {
      super(props);
      this.state = {
        visibility: false,
        currentQNotes: [],
        showAddNote: false,
        noteText: null,
        cleared: false,
      };
    }

    componentDidMount = () => {
      this._isMounted = true;
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/students"
      );
      if (this._isMounted) this.fetchQNotes();
      db.changes({ since: "now", live: true, include_docs: true }).on(
        "change",
        () => {
          if (this._isMounted) this.fetchQNotes();
        }
      );
    };

    componentDidUpdate = async () => {
      this.fetchQNotes();
      if (!this.props.sID && !this.state.cleared)
        await this.setState({ currentQNotes: [], cleared: true });
    };

    componentWillUnmount = () => {
      this._isMounted = false;
    };

    fetchQNotes = async () => {
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/students"
      );
      let x = this;
      if (this.props.sID) {
        let p = new Promise((resolve, reject) => {
          db.get(this.props.sID)
            .then(function (doc) {
              //x.setState({ currentQNotes: doc.notes });
              resolve(doc.notes);
            })
            .catch(function (err) {
              //console.log(err);
              reject(err);
            });
        });

        let s = await p;
        await this.setState({ currentQNotes: s, cleared: false });
      }
    };

    renderQNotes = () => {
      let sortedQ = this.state.currentQNotes;

      sortedQ.sort((a, b) => {
        if (a.date < b.date) return -1;

        if (a.date > b.date) return 1;

        return 0;
      });

      if (this.state.currentQNotes.length === 0) {
        return <h3>No notes added</h3>;
      } else {
        return sortedQ.map((e) => (
          <tr key={Math.random()}>
            <td>{e.date}</td>
            <td>{e.tutor}</td>
            <td>{e.description}</td>
          </tr>
        ));
      }
    };

    handleNoteText = (e) => {
      this.setState({ noteText: e.target.value });
    };

    handleNoteClick = () => {
      this.setState({ visibility: !this.state.visibility });
    };

    handleShowAddNote = () => {
      this.setState({ showAddNote: !this.state.showAddNote });
    };

    handleNoteSubmit = () => {
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/students"
      );

      let date = new Date();
      let today = date.toLocaleDateString();
      let noteObject = {
        date: today,
        tutor: sessionStorage.getItem("Tutor"),
        description: this.state.noteText,
      };

      if (this.state.noteText !== null && this.props.sID) {
        db.get(this.props.sID)
          .then(function (doc) {
            doc.notes.push(noteObject);
            return db.put(doc);
          })
          .catch(function (err) {
            console.log(err);
          });
        this.refs.noteTextRef.value = "";
      } else console.log("failed to post " + this.props.sID);
    };

    render() {
      return (
        <div className="container">
          <div className="row">
            <div className="buttons">
              <button onClick={this.handleNoteClick} className="btn btn-dark">
                {this.state.visibility ? "Hide Notes" : "Show Notes"}
              </button>
            </div>
            <div className="buttons">
              <button className="btn btn-dark" onClick={this.handleShowAddNote}>
                Add Note
              </button>
            </div>
          </div>
          <div className={this.state.visibility ? "showQNotes" : "hideQNotes"}>
            <br />
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tutor</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>{this.renderQNotes()}</tbody>
            </table>
          </div>
          <div
            className={this.state.showAddNote ? "showAddNote" : "hideAddNote"}
          >
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">Write a Note</span>
              </div>
              <textarea
                className="form-control"
                ref="noteTextRef"
                aria-label="With textarea"
                onChange={this.handleNoteText}
              ></textarea>
            </div>
            <div className="row d-flex justify-content-around">
              <button className="btn btn-dark" onClick={this.handleNoteSubmit}>
                Submit Note
              </button>
            </div>
          </div>
        </div>
      );
    }
  }
);

export default qNote;
