import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from './App';
import Home from "./Home";
import About from "./2D/About";
// import Landing from "./Landing";
// import Test from "./Test.js";
// import Test2 from "./Test2.js";
// import Test3 from "./Test3.js";
import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(<Home />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
