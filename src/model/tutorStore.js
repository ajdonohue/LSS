import PouchDB from "pouchdb";
import { observable } from "mobx";

export let TutorStore = observable({
  Tutor: {},
  Queue: [],
  QLength: null,
});

TutorStore.FetchTutor = async (id) => {
  let db = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
  );

  return db
    .get(id)
    .then(function (doc) {
      return doc;
    })
    .catch(function (err) {
      console.log(err);
    });
};

TutorStore.Fetch = (id) => {
  let db = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
  );
  let qDB = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
  );

  db.get(id)
    .then(function (doc) {
      if (!doc.isLoggedIn) {
        doc.isLoggedIn = true;
        db.put(doc);
      }
      return doc;
    })
    .then(function (doc) {
      TutorStore.Tutor = doc;
    })
    .then(() => {
      qDB
        .get(TutorStore.Tutor.programID)
        .then(function (doc) {
          return doc;
        })
        .then(function (doc) {
          TutorStore.Queue = doc.activeQ;
          TutorStore.QLength = doc.qLength;
        });
    })
    .catch(function (err) {
      console.log(err);
    });
};

TutorStore.FetchQueue = () => {
  let qDB = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
  );

  return qDB
    .get(TutorStore.Tutor.programID)
    .then(function (doc) {
      return doc;
    })
    .catch(function (err) {
      console.log(err);
    });
};

TutorStore.Clear = () => {
  TutorStore.Tutor = {};
  TutorStore.Queue = [];

  let db = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
  );

  if (sessionStorage.getItem("Tutor")) {
    db.get(sessionStorage.getItem("Tutor"))
      .then(function (doc) {
        doc.isLoggedIn = false;
        return db.put(doc);
      })
      .catch(function (err) {
        console.log(err);
      });
    sessionStorage.removeItem("Tutor");
  } else if (sessionStorage.getItem("Admin")) {
    db.get(sessionStorage.getItem("Admin"))
      .then(function (doc) {
        doc.isLoggedIn = false;
        return db.put(doc);
      })
      .catch(function (err) {
        console.log(err);
      });
    sessionStorage.removeItem("Admin");
  } else if (sessionStorage.getItem("Appointment")) {
    db.get(sessionStorage.getItem("Appointment"))
      .then(function (doc) {
        doc.isLoggedIn = false;
        return db.put(doc);
      })
      .catch(function (err) {
        console.log(err);
      });
    sessionStorage.removeItem("Appointment");
  }
};

TutorStore.GetQueue = (programID) => {
  let db = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
  );
  db.get(programID)
    .then(function (doc) {
      TutorStore.Queue = doc.activeQ;
    })
    .catch(function (err) {
      console.log(err);
    });
};

//time formatting probably needs some work
TutorStore.StartAppointment = (aID) => {
  let db = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
  );

  let date = new Date();
  let time = date.toLocaleTimeString();

  db.get(TutorStore.Tutor._id)
    .then(function (doc) {
      doc.activeAppointment.appointmentStart = time;
      return db.put(doc);
    })
    .then(() => {
      return db.get(TutorStore.Tutor._id);
    })
    .catch(function (err) {
      console.log(err);
    });
};

TutorStore.EndAppointment = (aID) => {
  let histDB = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
  );
  let studDB = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/students"
  );
  let tDB = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
  );
  let progDB = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
  );

  let date = new Date();
  let time = date.toLocaleTimeString();
  let completedAppointment = {};
  let studentID = 0;

  //get the appropriate program database
  //update the end time, copy the activeQ object for posting to historydb
  //add some properties to that object, filter the current q from program db
  //post history object and update student total appointments

  tDB
    .get(TutorStore.Tutor._id)
    .then(function (doc) {
      completedAppointment = doc.activeAppointment;
      completedAppointment._id = completedAppointment.id.toString();
      completedAppointment.appointmentEnd = time;
      completedAppointment.tutor = TutorStore.Tutor._id;
      completedAppointment.noShow = false;
      completedAppointment.cancelled = false;
      studentID = doc.activeAppointment.studentID;
      doc.activeAppointment = {};
      return tDB.put(doc);
    })
    .then(function () {
      return tDB.get(TutorStore.Tutor._id);
    })
    .then(function () {
      histDB.put(completedAppointment);
    })
    .then(function () {
      return studDB.get(studentID);
    })
    .then(function (doc) {
      doc.totalAppointments = doc.totalAppointments + 1;
      return studDB.put(doc);
    })
    .then(function () {
      return progDB.get(TutorStore.Tutor.programID);
    })
    .then(function (doc) {
      doc.currentQ = doc.currentQ - 1;
      doc.ETA = doc.ETA - doc.qLength;
      return progDB.put(doc);
    })
    .catch(function (err) {
      console.log(err);
    });
};

TutorStore.NoShow = (aID) => {
  let histDB = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/history"
  );
  let studDB = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/students"
  );
  let tDB = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/tutors"
  );
  let progDB = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
  );

  let completedAppointment = {};
  let date = new Date();
  let time = date.toLocaleTimeString();
  let studentID = 0;

  tDB
    .get(TutorStore.Tutor._id)
    .then(function (doc) {
      completedAppointment = doc.activeAppointment;
      completedAppointment._id = completedAppointment.id.toString();
      completedAppointment.appointmentEnd = time;
      completedAppointment.tutor = TutorStore.Tutor._id;
      completedAppointment.noShow = false;
      completedAppointment.cancelled = false;
      studentID = doc.activeAppointment.studentID;
      doc.activeAppointment = {};
      return tDB.put(doc);
    })
    .then(function () {
      histDB.put(completedAppointment);
    })
    .then(function () {
      return studDB.get(studentID);
    })
    .then(function (doc) {
      doc.noShows = doc.noShows + 1;
      return studDB.put(doc);
    })
    .then(function () {
      return progDB.get(TutorStore.Tutor.programID);
    })
    .then(function (doc) {
      doc.currentQ = doc.currentQ - 1;
      doc.ETA = doc.ETA - doc.qLength;
      return progDB.put(doc);
    })
    .catch(function (err) {
      console.log(err);
    });
};

export default TutorStore;
