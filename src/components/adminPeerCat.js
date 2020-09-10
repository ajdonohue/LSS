import React, { Component } from "react";
import PouchDB from "pouchdb";
import "../css/adminTutor.css";
import AdminPeerCatRender from "./adminPeerCatRender";

class AdminPeerCat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPeerCat: [],
      departmentInput: "",
      showAdd: false,
      addBtnState: false,
    };
  }

  componentDidMount = async () => {
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/peer_categories"
    );

    tDB
      .changes({ since: "now", live: true, include_docs: true })
      .on("change", () => {
        this.fetchPeerCat();
      });

    await this.fetchPeerCat();
    console.log(this.state.currentPeerCat);
  };

  handleUpdates = async () => {
    await this.fetchPeerCat;
  };

  fetchPeerCat = async () => {
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
    await this.setState({ currentPeerCat: tResult });
  };

  isOdd = (n) => {
    if (n % 2 === 0) return true;
    else return false;
  };

  renderPeerCat = () => {
    let counter = 0;
    return this.state.currentPeerCat.map((e) => (
      <AdminPeerCatRender
        rowType={this.isOdd(counter++)}
        id={e.doc._id}
        department={e.doc.department}
        mondayTimes={e.doc.mondayTimes}
        tuesdayTimes={e.doc.tuesdayTimes}
        wednesdayTimes={e.doc.wednesdayTimes}
        thursdayTimes={e.doc.thursdayTimes}
        fridayTimes={e.doc.fridayTimes}
      />
    ));
  };
  render() {
    return <>{this.renderPeerCat()}</>;
  }
}
export default AdminPeerCat;
