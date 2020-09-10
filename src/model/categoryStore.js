import { observable } from "mobx";
import PouchDB from "pouchdb";

export let CatStore = observable({
  Categories: []
});

CatStore.Fetch = () => {
  var db = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
  );

  db.allDocs({
    include_docs: true,
    attachments: true
  })
    .then(function(result) {
      CatStore.Categories = result.rows;
    })
    .catch(function(err) {
      console.log(err);
    });
};

CatStore.Waitlist = (programID, studentID) => {
  let db = new PouchDB(
    "https://b705ce6d-2856-466b-b76e-7ebd39bf5225-bluemix.cloudant.com/programs"
  );
  let d = new Date();
  let date = d.toLocaleDateString();
  let uuid = d.getTime();

  CatStore.Categories.forEach(e => {
    if (programID === e.doc._id) {
      // let hours = "";
      // let minutes = "";
      // if (date.getHours() > 12) hours = date.getHours() - 12;
      // else hours = date.getHours();
      // if (date.getMinutes() === 0) minutes = "00";
      // else if (date.getMinutes() < 10) minutes = 0 + date.getMinutes();
      // else minutes = date.getMinutes();
      //let time = hours + ":" + minutes;
      let l = e.doc.currentQ;
      let est = e.doc.ETA;
      let time = d.toLocaleTimeString();
      db.get(e.doc._id)
        .then(function(doc) {
          doc.currentQ = l + 1;
          doc.ETA = est + doc.qLength;
          let qObj = {
            id: uuid,
            studentID: studentID,
            programID: programID,
            date: date,
            timeQueued: time,
            appointmentStart: 0,
            appointmentEnd: 0
          };
          doc.activeQ.push(qObj);
          return db.put(doc);
        })
        .then(() => {
          return db.get(e.doc._id);
        })
        .then(function(doc) {
          e.doc.currentQ = doc.currentQ;
          e.doc.ETA = doc.ETA;
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  });
};

export default CatStore;
