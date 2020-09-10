import React, { Component } from "react";
import { observer } from "mobx-react";
import { toJS } from "mobx";
import PouchDB from "pouchdb";
import SideNav from "../components/sideNav";
import QNote from "../components/qNote";
import DashboardAnalytics from "../components/dashboardAnalytics";
import TutorQList from "../components/tutorQList";
import TutorActiveQ from "../components/tutorActiveQ";

//
//Props - 
//
//activeAppointment: boolean which sets whether appointment is active
//showAddNote: boolean which toggles whether add note scene is rendered
//firstQID: id of the next appointment
//minutes: minutes for timer
//seconds: seconds for timer
//scene: sets scene to home
//interval: holds interval for timer
//timeout: when timer ticks out
//activeQ: current appointment
//ts: tutor store
//q: array of students in the selected tutors program

const dashboardHome = observer(
  class DashboardHome extends Component {
    constructor(props) {
      super(props);
      this.state = {
        activeAppointment: false,
        showAddNote: false,
        firstQID: null,
        minutes: 0,
        seconds: 0,
        scene: "home",
        interval: null,
        timeout: null,
        activeQ: null,
        ts: null,
        q: null,
      };
    }
    componentDidMount = async () => {
      let tID = sessionStorage.getItem("Tutor");
      let response = await this.props.tutorStore.FetchTutor(tID);
      this.props.tutorStore.Tutor = response;
      await this.setState({ ts: response });
      this.props.tutorStore.Tutor = this.state.ts;
      let qResp = await this.props.tutorStore.FetchQueue();
      await this.setState({ q: qResp.activeQ });
      this.props.tutorStore.Queue = this.state.q;
      let qDB = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
      );
      qDB
        .changes({ since: "now", live: true, include_docs: true })
        .on("change", () => {
          this.props.tutorStore.Fetch(tID);
        });
    };

    renderHome = () => {
      const tid = sessionStorage.getItem("Tutor");
      let currentAppointment = toJS(
        this.props.tutorStore.Tutor.activeAppointment,
        false
      );

      return (
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2">
            <div className="col">
              <TutorQList tutorStore={this.props.tutorStore} />
            </div>
            <div className="col">
              <TutorActiveQ
                activeQ={this.state.activeQ}
                tutorStore={this.props.tutorStore}
                tID={tid}
              />
            </div>
          </div>
          <div className="row row-cols-1 row-cols-sm-2">
            <QNote
              sID={currentAppointment ? currentAppointment.studentID : null}
              tutorStore={this.props.tutorStore}
            />
          </div>
        </div>
      );
    };

    renderAnalyticsScene = () => {
      return <DashboardAnalytics tutorStore={this.props.tutorStore} />;
    };

    renderScene = () => {
      let scene = this.state.scene;
      if (scene === "home") return this.renderHome();
      else if (scene === "analytics") return this.renderAnalyticsScene();
    };

    handleAnalyticsScene = () => {
      this.setState({ scene: "analytics" });
    };

    handleHomeScene = () => {
      this.setState({ scene: "home" });
    };

    //the side nav bar should be its own component and needs to be cleaned up
    render() {
      return (
        <div className="wrapper">
          <SideNav
            tutorStore={this.props.tutorStore}
            history={this.props.history}
            analytics={this.handleAnalyticsScene}
            home={this.handleHomeScene}
          />
          {this.renderScene()}
        </div>
      );
    }
  }
);

export default dashboardHome;
