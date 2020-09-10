import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import CatStore from "./model/categoryStore";
import TutorStore from "./model/tutorStore";

ReactDOM.render(
  <App catStore={CatStore} tutorStore={TutorStore} />,
  document.getElementById("root")
);
