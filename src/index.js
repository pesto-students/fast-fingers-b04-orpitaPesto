import React from 'react';
import ReactDOM from 'react-dom';
import FastFingersApp from "./fast-fingersApp";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import GamePage from "./components/Game/game";
import GameOver from "./components/GameOver/gameOver";

ReactDOM.render(
  <React.StrictMode>
   <BrowserRouter>
      <Switch>
        <Route path="/" component={FastFingersApp} exact={true} />
        <Route path="/game" component={GamePage} exact={true}/>
        <Route path="/gameOver" component={GameOver} exact={true}/>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
