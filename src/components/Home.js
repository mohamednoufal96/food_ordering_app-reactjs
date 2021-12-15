import React, { Component } from "react";
import axios from "axios";

import "../styles/Home.css";

import QuickSearches from "./QuickSearches";
import Wallpaper from "./Wallpaper";

const API_URL = require("../constants").API_URL;

export default class Home extends Component {
    constructor() {
        super();

        this.state = {
            locations: [],
            mealTypes: [],
        };
    }

    componentDidMount() {
        //to get all locations
        axios
            .get(`${API_URL}/getAllLocations`)
            .then((resp) => {
                this.setState({
                    locations: resp.data.locations,
                });
            })
            .catch((error) => {
                console.log(error);
            });

        // to get all mealTypes
        axios
            .get(`${API_URL}/getAllMealTypes`)
            .then((resp) => {
                this.setState({
                    mealTypes: resp.data.mealTypes,
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        const { locations, mealTypes } = this.state;
        return (
            <>
                <Wallpaper locationData={locations} />
                <QuickSearches mealTypesData={mealTypes} />
            </>
        );
    }
}
