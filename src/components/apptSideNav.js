import React, { Component } from "react";
import { Link } from "react-router-dom";
import PouchDB from "pouchdb";

class ApptSideNav extends Component {
  constructor(props) {
    super(props);
    this.state = { name: " " };
  }

  componentDidMount = () => {
    this.getTutorName();
  };

  handleLogout = () => {
    this.props.tutorStore.Clear();
    this.props.history.push("/");
  };

  getTutorName = async () => {
    let tID = sessionStorage.getItem("Appointment");
    let tDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
    );

    let tPromise = new Promise((resolve, reject) => {
      tDB
        .get(tID)
        .then(function (doc) {
          let name = doc.firstName;
          resolve(name);
        })
        .catch(function (err) {
          reject(err);
        });
    });

    let tResult = await tPromise;

    this.setState({ name: tResult });
  };

  render() {
    return (
      <nav className="sideNav">
        <div className="sidebar-header">
          <h4>Welcome, {this.state.name}</h4>
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
      </nav>
    );
  }
}

export default ApptSideNav;
