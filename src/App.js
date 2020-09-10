import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/home.js";
import Nav from "./components/nav.js";
import StudentValidate from "./pages/studentValidate.js";
import TutoringCategories from "./pages/tutoringCategories.js";
import WaitListed from "./pages/waitlisted.js";
import TutorLogin from "./pages/tutorLogin.js";
import DashboardHome from "./pages/dashboardHome.js";
import DashboardProf from "./components/dashboardProf.js";
import DashboardAnalytics from "./components/dashboardAnalytics.js";
import AdminHome from "./pages/adminHome";
import { observer } from "mobx-react";
import AppointmentDashboard from "./pages/appointmentDash.js";
import TutorOptions from "./pages/peerTutor.js";

const app = observer(
  class App extends Component {
    componentDidMount() {
      // let t = sessionStorage.getItem("Tutor");
      // if (t) {
      //   this.props.tutorStore.Fetch();
      // }
    }

    render() {
      return (
        <BrowserRouter>
          <Nav />
          <Switch>
            <Route exact path="/" render={(props) => <Home {...props} />} />
            <Route
              exact
              path="/validate"
              render={(props) => <StudentValidate {...props} />}
            />
            <Route
              exact
              path="/categories"
              render={(props) => (
                <TutoringCategories {...props} catStore={this.props.catStore} />
              )}
            />
            <Route
              exact
              path="/waitlisted"
              render={(props) => <WaitListed {...props} />}
            />
            <Route
              exact
              path="/tutorlogin"
              render={(props) => <TutorLogin {...props} />}
            />
            <Route
              exact
              path="/tutordashboard"
              render={(props) => (
                <DashboardHome {...props} tutorStore={this.props.tutorStore} />
              )}
            />
            <Route
              exact
              path="/appointmentdashboard"
              render={(props) => (
                <AppointmentDashboard
                  {...props}
                  tutorStore={this.props.tutorStore}
                />
              )}
            />
            <Route
              exact
              path="/tutorprofile"
              render={(props) => (
                <DashboardProf {...props} tutorStore={this.props.tutorStore} />
              )}
            />
            )} />
            <Route
              exact
              path="/adminhome"
              render={(props) => (
                <AdminHome
                  {...props}
                  tutorStore={this.props.tutorStore}
                  catStore={this.props.catStore}
                />
              )}
            />
             <Route
              exact
              path="/peertutor"
              render={props => (
                <TutorOptions {...props} tutorStore={this.props.tutorStore} />
              )}
            />
          </Switch>
        </BrowserRouter>
      );
    }
  }
);

export default app;
