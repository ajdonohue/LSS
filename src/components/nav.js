import React, { Component } from "react";
import { Link } from "react-router-dom";
import  Logo  from "../logo.jpg";
import "../css/main.css";

class Nav extends Component {
  render() {
    return (
      <nav className="navbar navbar-expand-lg navContainer">
        <Link to="/">
          <img className="logoPH" src={Logo}/>
        </Link>
        <div
          className="collapse navbar-collapse container-fluid"
          id="navbarNav"
        >
          <ul className="navbar-nav mx-auto">Learner Success Services</ul>
        </div>
      </nav>
    );
  }
}

export default Nav;
