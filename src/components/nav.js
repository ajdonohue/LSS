import React, { Component } from "react";
import { Link } from "react-router-dom";
import Logo from "../logo.jpg";
import "../css/main.css";

class Nav extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navContainer">
        <Link to="/">
          <img className="logoPH" src={Logo} alt="BVC Logo" />
        </Link>
        <div className="navTitle">
          <ul className="navbar-nav mx-auto">Learner Success Services</ul>
        </div>
        <div className="topBarNav">
          <div className="topbar-header">
            <h4>Welcome</h4>
          </div>
          <ul className="list-unstyled components">
            <Link to="/tutordashboard">
              <li className="topNavLI col" onClick={this.props.home}>
                Home
              </li>
            </Link>
            <Link>
              <li className="topNavLI col" onClick={this.props.analytics}>
                Analytics
              </li>
            </Link>
            <Link>
              <li className="topNavLI col" onClick={this.handleLogout}>
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

export default Nav;
