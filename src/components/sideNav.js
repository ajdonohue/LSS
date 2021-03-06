import React, { Component } from "react";
import { Link } from "react-router-dom";

class SideNav extends Component {
  handleLogout = () => {
    this.props.tutorStore.Clear();
    this.props.history.push("/");
  };

  render() {
    return (
      <nav className="sideNav">
        <div className="sideBarNav">
          <div className="sidebar-header">
            <h4>Welcome, {this.props.tutorStore.Tutor._id}</h4>
          </div>
          <ul className="list-unstyled components">
            <Link to="/tutordashboard">
              <li className="sideNavLI" onClick={this.props.home}>
                Home
              </li>
            </Link>
            <Link>
              <li className="sideNavLI" onClick={this.props.analytics}>
                Analytics
              </li>
            </Link>
            <Link>
              <li className="sideNavLILogout" onClick={this.handleLogout}>
                {" "}
                Logout{" "}
              </li>
            </Link>
          </ul>
        </div>        
      </nav>
    );
  }
}

export default SideNav;
