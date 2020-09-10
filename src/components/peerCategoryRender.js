import React, { Component } from "react";
import "../css/peerCategoryRender.css";

//
// Props -
//
// department: department for peer tutoring
// monday ... fridayTimes: array of objects with start & endtimes, as well as location
// of the peertutoring session
//

class PeerCategoryRender extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedDay: "mon" };
  }
  componentDidMount = () => {};

  renderDayTimes = () => {
    if (this.state.selectedDay === "mon") {
      if (this.props.mondayTimes.length === 0) {
        return (
          <div className="row">
            <div className="coll">
              <h3>No times for this day</h3>
            </div>
          </div>
        );
      } else {
        return this.props.mondayTimes.map((e) => (
          <div className="row timeRow" key={e.start}>
            <div className="col-4">{e.start}</div>
            <div className="col-4">{e.end}</div>
            <div className="col-4">{e.location}</div>
          </div>
        ));
      }
    } else if (this.state.selectedDay === "tues") {
      if (this.props.tuesdayTimes.length === 0) {
        return (
          <div className="row">
            <div className="col">
              <h3>No times for this day</h3>
            </div>
          </div>
        );
      } else {
        return this.props.tuesdayTimes.map((e) => (
          <div className="row timeRow" key={e.start}>
            <div className="col-4">{e.start}</div>
            <div className="col-4">{e.end}</div>
            <div className="col-4">{e.location}</div>
          </div>
        ));
      }
    } else if (this.state.selectedDay === "wed") {
      if (this.props.wednesdayTimes.length === 0) {
        return (
          <div className="row">
            <div className="coll">
              <h3>No times for this day</h3>
            </div>
          </div>
        );
      } else {
        return this.props.wednesdayTimes.map((e) => (
          <div className="row timeRow" key={e.start}>
            <div className="col-4">{e.start}</div>
            <div className="col-4">{e.end}</div>
            <div className="col-4">{e.location}</div>
          </div>
        ));
      }
    } else if (this.state.selectedDay === "thurs") {
      if (this.props.thursdayTimes.length === 0) {
        return (
          <div className="row">
            <div className="coll">
              <h3>No times for this day</h3>
            </div>
          </div>
        );
      } else {
        return this.props.thursdayTimes.map((e) => (
          <div className="row timeRow" key={e.start}>
            <div className="col-4">{e.start}</div>
            <div className="col-4">{e.end}</div>
            <div className="col-4">{e.location}</div>
          </div>
        ));
      }
    } else if (this.state.selectedDay === "fri") {
      if (this.props.fridayTimes.length === 0) {
        return (
          <div className="row">
            <div className="coll">
              <h3>No times for this day</h3>
            </div>
          </div>
        );
      } else {
        return this.props.fridayTimes.map((e) => (
          <div className="row timeRow" key={e.start}>
            <div className="col-4">{e.start}</div>
            <div className="col-4">{e.end}</div>
            <div className="col-4">{e.location}</div>
          </div>
        ));
      }
    }
  };

  handleSelectChange = (e) => {
    this.setState({ selectedDay: e.target.value });
  };

  render() {
    return (
      <div className="container mainBG">
        <div className="row">
          <div className="col">{this.props.department}</div>
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col">
            <select onChange={this.handleSelectChange}>
              <option value="mon">Monday</option>
              <option value="tues">Tuesday</option>
              <option value="wed">Wednesday</option>
              <option value="thurs">Thursday</option>
              <option value="fri">Friday</option>
            </select>
          </div>
        </div>
        <> {this.renderDayTimes()}</>
      </div>
    );
  }
}

export default PeerCategoryRender;
