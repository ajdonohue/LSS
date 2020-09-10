import React, { Component } from "react";
import PouchDB from "pouchdb";
import { Link } from "react-router-dom";
import PeerCategoryRender from "../components/peerCategoryRender";
import CategoryRender from "../components/categoryRender";
import { toJS } from "mobx";
import StudentValidate from "./studentValidate";

class TutorOptions extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      peerCategories: null,
      peerHistory: null,
      scene: "default",
      value: null,
      peerCategorie: "",
      date: "",
      time: null,
      Queue: []
    };
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount = async () => {
    this.fetchPeerTutoring();
    let s = sessionStorage.getItem("studentID");

    var today = new Date(),
      newdate = (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear(),
      newtime = today.getTime()
      this.setState({date: newdate.toString()});
      this.setState({time: newtime.toString()});
  };

  generateOptions = () => {
    let array = this.state.peerCategories;

    if (array !== null) {
      return array.map((e) => <option value={e.id} key={e.id}>{e.id}</option>);
    }
  };

  fetchPeerTutoring = async () => {
    let ptDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/peer_categories"
    );

    let ptPromise = new Promise((resolve, reject) => {
      ptDB
        .allDocs({
          include_docs: true,
          attachments: true,
        })
        .then(function (docs) {
          resolve(docs.rows);
        })
        .catch(function (err) {
          reject(console.log(err));
        });
    });

    let ptResult = await ptPromise;
    await this.setState({ peerCategories: ptResult });
    console.log(this.state.peerCategories);
  };

  addStudentScene = () => {
    this.setState({scene: "addStudent"})
  };

  handleChange = (event) => {
    this.setState({scene: "PeerTutor"});
    this.setState({peerCategorie: event.target.value});
    console.log(this.state.peerCategorie);
    this.getPeerTutorList();
  };

  renderDefault = () => {
    return (
      <div className="container">
        <h1 className="validateLead">Please Select A Peer Tutor Catergory</h1>
        <div className="validateContainer">
          <select onChange={this.handleChange}>
            <option key="Def" value="Def">Select A Catergory</option>
            {this.generateOptions()}
            </select>
        </div>
      </div>
    );
  };

  addStudentToPeer = (e) => {
    let peerdb = new PouchDB (
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/peer_history"
    );

    peerdb.put(e).catch(function(err){
      console.log(err)
    });
  };

  getPeerTutorList = async () => {
    let ptDB = new PouchDB(
      "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/peer_history"
    );

    let ptPromise = new Promise((resolve, reject) => {
      ptDB
        .allDocs({
          include_docs: true,
          attachments: true,
        })
        .then(function (docs) {
          resolve(docs.rows);
        })
        .catch(function (err) {
          reject(console.log(err));
        });
    });

    let ptResult = await ptPromise;
    await this.setState({peerHistory: ptResult});
    console.log(this.state.peerHistory);
  };

  getQueue = () => {
    let array = this.state.peerHistory;
    if (array !== null) {
      return array.map((e => {
        if (e.doc.department === this.state.peerCategorie && e.doc.Date === this.state.date) {
          let students = e.doc.Students
          console.log(students)
        return students.map((a) => <p key={a.student_id}> Student Id: {a.student_id}</p> );
          //this.setState({Queue: list});
        }
        
        console.log(this.state.Queue);
        console.log("Date: " + this.state.date);
      }))
    }
  };

  addStudentToQueue = (e) =>{
    this.state.Queue.push(e);
    this.setState({scene: "PeerTutor"});
  }

  renderQueue = () => {
  return this.state.Queue.map((e) => <p key={e}>Student Id: {e}</p>);
  }

  renderStudentScene = () => {
    return (
    <StudentValidate 
    date = {this.state.date}
    time = {this.state.time}
    scene = {this.state.scene}
    queue = {this.state.queue}
    peerCategorie = {this.state.peerCategorie}
    addStudentToQueue= {this.addStudentToQueue}
    addStudentToPeer = {this.addStudentToPeer}/>
    );
  }

  renderPeerTutorScene = () => {
    return (
      <div className="container">
        <h1 className="validateLead">{this.state.peerCategorie}</h1>
    <h3 className="validateLead">{this.state.date}</h3>
        <div className="validateContainer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-6">
                {this.renderQueue()}
              </div>
            </div>
          </div>
          <button className="qCartBtns" onClick={this.addStudentScene}>Add Student</button>
        </div>
      </div>
    )
  }

  renderScene = () => {
    let scene = this.state.scene;
    if (scene === "default") return this.renderDefault();
    else if (scene === "addStudent") return this.renderStudentScene();
    else if (scene === "PeerTutor") return this.renderPeerTutorScene();
  }

  render() {
    return (
      <div>
        {console.log(this.state.scene)}
        {console.log(this.state.peerCategorie)}
        {this.renderScene()}
      </div>
    )
  }
}

export default TutorOptions;