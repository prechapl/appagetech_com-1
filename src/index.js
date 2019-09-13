import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from './App';
import Home from "./Home";
import Landing from "./Landing";
import TransitionExample from "./TransitionExample";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<TransitionExample />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
