import React, { Component } from "react";
import { Link } from "react-router-dom";

class Waitlisted extends Component {
  render() {
    return (
      <div className="container">
        <div className="successContainer">
          <h1 className="display-1">Success!</h1>
          <h3 className="lead waitPara">
            You have successfully been added to the waitlist! Check your phone
            for details{" "}
          </h3>
        </div>
        <div className="row btnHome">
          <div className="col-6 d-flex justify-content-center">
            <Link to="/">
              <button className="btn btn-lg qBtn">Home</button>
            </Link>
          </div>
          <div className="col-6 d-flex justify-content-center">
            <Link to="/categories">
              <button className="btn btn-lg qBtn">Categories</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Waitlisted;
