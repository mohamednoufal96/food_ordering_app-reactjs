import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "../styles/Wallpaper.css";

const API_URL = require("../constants").API_URL;

class Wallpaper extends Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            text: "",
            suggestions: [],
        };
    }

    getRestaurantsForLocation = (e) => {
        const selectedLocation_id = e.target.value;
        if (selectedLocation_id) {
            const selectedLocation = this.props.locationData.find(
                (item) => item.location_id === parseInt(selectedLocation_id)
            );
            const city_id = selectedLocation.city_id;
            const city_name = selectedLocation.city;

            // set the city Id in localStorage
            localStorage.setItem("city_id", city_id);

            // fetch the restaurants for this location
            axios
                .get(`${API_URL}/getAllRestaurantsByLocation/${city_name}`)
                .then((resp) => {
                    this.setState({
                        restaurants: resp.data.restaurants,
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    onSearchTextChange = (e) => {
        const searchText = e.target.value;
        const { restaurants } = this.state;
        let suggestions = [];
        if (searchText.length > 0) {
            suggestions = restaurants.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()));
        }
        this.setState({
            text: searchText,
            suggestions: suggestions || [],
        });
    };

    renderSuggestions = () => {
        const { suggestions } = this.state;
        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul className="suggestion-box px-2 mt-1">
                {suggestions.map((item, index) => {
                    return (
                        <li key={index} className="item p-2" onClick={() => this.goToRestaurant(item)}>
                            <div className="d-flex ">
                                <img src={require(`../${item.image}`)} alt="not found" />
                                <div className="text-container px-4">
                                    <div className="name">{item.name}</div>
                                    <div className="locality">{item.locality}</div>
                                </div>
                            </div>
                            <h4 className="order-button  text-danger ">Order Now</h4>
                        </li>
                    );
                })}
            </ul>
        );
    };

    goToRestaurant = (item) => {
        this.props.history.push(`/details?id=${item._id}`);
    };

    render() {
        const { locationData } = this.props;
        return (
            <section className="banner-container pb-3">

                <div className="container content  ">
                    <div className="banner__logo mx-auto ">e!</div>
                    <div className="heading text-white">Find the best restaurants, cafés, and bars</div>

                    <div className="search-options row">
                        <div className="selectLocation-container col-md-5 mt-2 mb-2 px-1 ">
                            <select className="select-location px-3" onChange={this.getRestaurantsForLocation}>
                                <option value="">Please select a location</option>
                                {locationData.map((item, index) => {
                                    return (
                                        <option key={index} value={item.location_id}>
                                            {item.name}, {item.city}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                        <div className="searchbox-container  col-md-7   mt-2  px-1 ">
                            <i className="bi bi-search search-icon"></i>
                            <input
                                className="restaurant-search  px-5  rounded-0 text-truncate"
                                type="search"
                                placeholder=" Search a restaurant"
                                onChange={this.onSearchTextChange}
                            />
                            {this.renderSuggestions()}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withRouter(Wallpaper);
