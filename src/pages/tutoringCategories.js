import React, { Component } from "react";
import CategoryRender from "../components/categoryRender";
import PouchDB from "pouchdb";
import PouchdbFind from "pouchdb-find";
import { observer } from "mobx-react";
import PeerCategoryRender from "../components/peerCategoryRender";
import AppointmentCategoryRender from "../components/appointmentCategoryRender";
import CategoryAppointmentBooking from "../components/categoryAppointmentBooking";

//
// Props -
//
//peerCategories: array of peer tutoring categories
//appointmentTutors: array of tutors
//scene: set to main
//selectedAppointmentTutor: the tutor which student tries to book appointment with

const tutoringCategories = observer(
  class TutoringCategories extends Component {
    constructor(props) {
      super(props);
      PouchDB.plugin(PouchdbFind);
      this.state = {
        peerCategories: [],
        appointmentTutors: [],
        scene: "main",
        selectedAppointmentTutor: null,
      };
    }

    componentDidMount = async () => {
      this.props.catStore.Fetch();
      await this.fetchPeerTutoring();
      await this.fetchAppointmentTutors();
    };

    fetchAppointmentTutors = async () => {
      let taDB = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
      );

      let taPromise = new Promise((resolve, reject) => {
        taDB
          .find({
            selector: {
              role: { $eq: "Appointment" },
            },
          })
          .then(function (result) {
            resolve(result);
          })
          .catch(function (err) {
            console.log(err);
            reject(err);
          });
      });

      let taResult = await taPromise;
      let tutors = taResult.docs;
      await this.setState({ appointmentTutors: tutors });
    };

    fetchPeerTutoring = async () => {
      let ptDB = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/peer_categories"
      );

      let ptPromise = new Promise((resolve, reject) => {
        ptDB
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

      let ptResult = await ptPromise;
      await this.setState({ peerCategories: ptResult });
    };

    renderCategories = () => {
      let Cats = this.props.catStore.Categories;

      return Cats.map((e) => (
        <section key={e.doc._id}>
          <CategoryRender
            currentQ={e.doc.currentQ}
            desc={e.doc.desc}
            ETA={e.doc.ETA}
            name={e.doc._id}
            catStore={this.props.catStore}
          />
        </section>
      ));
    };

    renderAppointmentCategories = () => {
      let at = this.state.appointmentTutors;

      return at.map((e) => (
        <section key={e._id}>
          <AppointmentCategoryRender
            id={e._id}
            tutor={e}
            firstName={e.firstName}
            lastName={e.lastName}
            bookingScene={this.handleBookingScene}
          />
        </section>
      ));
    };

    renderPeerCategories = () => {
      let pc = this.state.peerCategories;

      return pc.map((e) => (
        <section key={e.doc._id}>
          <PeerCategoryRender
            department={e.doc.department}
            mondayTimes={e.doc.mondayTimes}
            tuesdayTimes={e.doc.tuesdayTimes}
            wednesdayTimes={e.doc.wednesdayTimes}
            thursdayTimes={e.doc.thursdayTimes}
            fridayTimes={e.doc.fridayTimes}
          />
        </section>
      ));
    };

    handleBookingScene = (e) => {
      this.setState({ scene: "booking", selectedAppointmentTutor: e });
    };

    handleMainScene = () => {
      this.setState({ scene: "main" });
    };

    renderMainScene = () => {
      return (
        <div className="container">
          <div className="row">
            <div className="col categoryLead">
              <h1>Peer Tutoring Categories</h1>
              <p>
                Find information on when and where a verified peer tutor will be
                available
              </p>
            </div>
          </div>
          <div className="cards">
            <div className="row row-cols-sm d-flex justify-content-around">
              {this.renderPeerCategories()}
            </div>
          </div>
          <div className="row">
            <div className="col categoryLead">
              <h1>Tutoring Categories</h1>
              <p>
                Queue up for one on one tutoring with a member of the LSS staff
              </p>
            </div>
          </div>
          <div className="cards">
            <div className="row row-cols-sm d-flex justify-content-center">
              {this.renderCategories()}
            </div>
          </div>
          <div className="row">
            <div className="col categoryLead">
              <h1>Tutoring Appointments</h1>
              <p>Book an appointment with a LSS learning coach</p>
            </div>
          </div>
          <div className="cards">
            <div className="row row-cols-sm d-flex justify-content-around">
              {this.renderAppointmentCategories()}
            </div>
          </div>
        </div>
      );
    };

    renderBookingScene = () => {
      let t = this.state.selectedAppointmentTutor;
      if (t !== null)
        return (
          <CategoryAppointmentBooking
            tutor={this.state.selectedAppointmentTutor}
            mainScene={this.handleMainScene}
          />
        );
    };

    renderScene = () => {
      let scene = this.state.scene;
      if (scene === "main") {
        return <>{this.renderMainScene()}</>;
      } else if (scene === "booking") {
        return <>{this.renderBookingScene()}</>;
      }
    };

    render() {
      return <> {this.renderScene()} </>;
    }
  }
);

export default tutoringCategories;
