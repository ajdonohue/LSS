import React, { Component } from "react";
import { Link } from "react-router-dom";

class DashboardProf extends Component {
  state = {};
  render() {
    return (
      <div class="wrapper">
        <nav id="sidebar">
          <div class="sidebar-header">
            <h3>Tutor Dashboard</h3>
          </div>
          <ul class="list-unstyled components">
            <li class="active">
              <ul class="collapse list-unstyled" id="pageSubmenu"></ul>
            </li>
            <Link to="/tutordashboard">
              <li>Home</li>
            </Link>
            <Link to="/tutorprofile">
              <li>Profile</li>
            </Link>
            <Link to="/tutoranalytics">
              <li>Analytics</li>
            </Link>
          </ul>
        </nav>
        <div id="content">
          <div class="container-fluid">
            <div>
              <ul class="list-group list-group-horizontal">
                <li class="list-group-item">Day</li>
                <li class="list-group-item">Month</li>
                <li class="list-group-item">Week</li>
              </ul>
            </div>
            <div className="row"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default DashboardProf;
