import React, { Component } from "react";
import Home from "./components/Home";
import Filter from "./components/Filter";
import Details from "./components/Details";
import Header from "./components/Header";

import { BrowserRouter as Router, Route } from "react-router-dom";

export default class Routing extends Component {
    render() {
        return (
            <Router>
                <Header />
                <Route path="/" exact component={Home} />
                <Route path="/home" component={Home} />
                <Route path="/filter" component={Filter} />
                <Route path="/details" component={Details} />
            </Router>
        );
    }
}
