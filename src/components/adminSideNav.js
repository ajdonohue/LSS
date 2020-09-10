import React, { Component } from "react";
import { Link } from "react-router-dom";

class AdminSideNav extends Component {
  handleLogout = () => {
    this.props.tutorStore.Clear();
    this.props.history.push("/");
  };

  render() {
    return (
      <nav className="sideNav">
        <div className="sidebar-header">
          <h4>Welcome, Admin</h4>
        </div>
        <ul className="list-unstyled components">
          <Link>
            <li className="sideNavLI" onClick={this.props.tutorScene}>
              Tutors
            </li>
          </Link>
          <Link>
            <li className="sideNavLI" onClick={this.props.queueCatScene}>
              Queue Categories
            </li>
          </Link>
          <Link>
            <li className="sideNavLI" onClick={this.props.peerCatScene}>
              Peer Tutor Categories
            </li>
          </Link>
          <Link>
            <li className="sideNavLI" onClick={this.props.analyticsScene}>
              Analytics
            </li>
          </Link>
          <Link>
            <li className="sideNavLI" onClick={this.props.historyScene}>
              History
            </li>
          </Link>
          <Link>
            <li className="sideNavLILogout" onClick={this.handleLogout}>
              {" "}
              Logout{" "}
            </li>
          </Link>
        </ul>
      </nav>
    );
  }
}

export default AdminSideNav;
