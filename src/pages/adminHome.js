import React, { Component } from "react";
import { observer } from "mobx-react";
import PouchDB from "pouchdb";
import HistoryRender from "../components/historyRender";
import AdminSideNav from "../components/adminSideNav";
import AdminTutors from "../components/adminTutors";
import AdminPeerCat from "../components/adminPeerCat";

const adminHome = observer(
  class AdminHome extends Component {
    constructor(props) {
      super(props);
      this.state = {
        scene: "tutor",
        history: [],
      };
    }

    componentDidMount = () => {
      let db = new PouchDB(
        "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
      );

      let x = this;
      db.allDocs({
        include_docs: true,
        attachments: true,
      })
        .then(function (result) {
          x.setState({ history: result.rows });
        })
        .catch(function (err) {
          console.log(err);
        });
    };

    renderHistory = () => {
      return this.state.history.map((e) => (
        <div className="col">
          <section key={e.doc.id}>
            <HistoryRender
              id={e.doc.id}
              sID={e.doc.studentID}
              pID={e.doc.programID}
              date={e.doc.date}
              timeQD={e.doc.timeQueued}
              aStart={e.doc.appointmentStart}
              aEnd={e.doc.appointmentEnd}
              tutor={e.doc.tutor}
            />
          </section>
        </div>
      ));
    };

    handleTutorScene = () => {
      this.setState({ scene: "tutor" });
    };

    handlePeerCategoriesScene = () => {
      this.setState({ scene: "peerCategories" });
    };
    handleQueueCategoriesScene = () => {
      this.setState({ scene: "queueCategories" });

      console.log("clicked");
    };

    handleAnalyticsScene = () => {
      this.setState({ scene: "analytics" });
    };

    handleHistoryScene = () => {
      this.setState({ scene: "history" });
    };

    renderScene = () => {
      let scene = this.state.scene;
      if (scene === "tutor") {
        return <AdminTutors />;
      } else if (scene === "queueCategories") {
        return <h1>queue cat to be added</h1>;
      } else if (scene === "peerCategories") {
        return <AdminPeerCat />;
      } else if (scene === "analytics") {
        return <h1>anals to be added</h1>;
      } else if (scene === "history") {
        return <div className="row">{this.renderHistory()}</div>;
      }
    };

    render() {
      return (
        <div class="wrapper">
          <AdminSideNav
            tutorStore={this.props.tutorStore}
            history={this.props.history}
            tutorScene={this.handleTutorScene}
            peerCatScene={this.handlePeerCategoriesScene}
            queueCatScene={this.handleQueueCategoriesScene}
            analyticsScene={this.handleAnalyticsScene}
            historyScene={this.handleHistoryScene}
          />
          <div className="container-fluid">{this.renderScene()}</div>
        </div>
      );
    }
  }
);

export default adminHome;
