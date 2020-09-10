import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../css/main.css";

class Home extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row lead">
          <h1 className="homeLead fatFont">Learner Success Services</h1>
          <h3 className="homeLead"> Tutoring</h3>
          <p className="homeLead">
            Services to help you thrive in school, in work, and in life.
          </p>
          <p className="homeLead homePara">
            Lifelong learning starts here. You can meet your education goals, no
            matter where you're starting from. If you need basic literacy or
            high school credits and upgrading, we'll put you on the path to
            success.
          </p>
        </div>
        <div className="row btnHome">
          <div className="col-6 d-flex justify-content-center">
            <Link to="/tutorlogin">
              <button className="btn btn-lg qBtn">Tutors</button>
            </Link>
          </div>
          <div className="col-6 d-flex justify-content-center">
            <Link to="/validate">
              <button className="btn btn-lg qBtn">Students</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
