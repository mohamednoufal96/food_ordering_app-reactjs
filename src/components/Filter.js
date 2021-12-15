import React, { Component } from "react";
import queryString from "query-string";
import axios from "axios";
import { withRouter } from "react-router";

import "../styles/Filter.css";

const API_URL = require("../constants").API_URL;

class Filter extends Component {
    constructor() {
        super();
        this.state = {
            mealName: "",
            mealType: "",
            locations: [],
            selectedCityName: "",
            locationsInCity: [],
            selectedLocaton: "",
            cuisines: [],
            pageNo: 1,
            noOfPages: 0,
            restaurantList: [],
            totalResults: 0,
            lCost: undefined,
            hCost: undefined,
            sortOrder: 1,
        };
    }

    componentDidMount = () => {
        const params = queryString.parse(this.props.location.search);
        const { mealName, mealType } = params;

        this.setState({
            mealName,
            mealType,
        });

        const city_id = localStorage.getItem("city_id");

        // fetch the locaions
        axios
            .get(`${API_URL}/getAllLocations`)
            .then((resp) => {
                const locations = resp.data.locations;
                const selectedCity = locations.find((item) => item.city_id === parseInt(city_id));
                const selectedCityLocations = locations.filter((item) => item.city_id === parseInt(city_id));
                this.setState({
                    locations,
                    selectedCityName: selectedCity.city,
                    locationsInCity: selectedCityLocations,
                    selectedLocaton: selectedCityLocations[0].location_id,
                });
            })
            .catch((err) => {
                console.log(err);
            });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    };

    filterRestaurants = () => {
        // logic to filter the restaurants
        const { mealType, selectedLocation, cuisines, hCost, lCost, sortOrder, pageNo } = this.state;

        const req = {
            mealtype: mealType,
            location: selectedLocation,
            page: pageNo,
        };

        if (cuisines.length > 0) {
            req.cuisine = cuisines;
        }

        if (hCost !== undefined && lCost !== undefined) {
            req.hcost = hCost;
            req.lcost = lCost;
        }

        if (sortOrder !== undefined) {
            req.sort = sortOrder;
        }

        axios({
            method: "POST",
            url: `${API_URL}/filter`,
            headers: { "Content-Type": "application/json" },
            data: req,
        })
            .then((result) => {
                const { restaurants, totalResultsCount, pageNo, pageSize } = result.data;
                this.setState({
                    pageNo: pageNo,
                    restaurantList: restaurants,
                    totalResults: totalResultsCount,
                    noOfPages: Math.ceil(totalResultsCount / pageSize),
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    handleLocationChange = (event) => {
        const location_id = event.target.value;

        this.setState({
            selectedLocation: location_id,
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    };

    handleCuisineChange = (event, cuisine) => {
        let { cuisines } = this.state;
        const index = cuisines.indexOf(cuisine);

        if (index < 0 && event.target.checked) {
            cuisines.push(cuisine);
        } else {
            cuisines.splice(index, 1);
        }

        this.setState({
            cuisines,
        });
        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    };

    handleCostChange = (event, lCost, hCost) => {
        this.setState({
            lCost: lCost,
            hCost: hCost,
        });

        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    };

    handleSortChange = (event, sortOrder) => {
        this.setState({
            sortOrder: sortOrder,
        });

        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    };

    goToRestaurant = (restaurant) => {
        const url = `/detals?id=${restaurant._id}`;
        this.props.history.push(`/details`);
    };

    getPages = () => {
        const { noOfPages } = this.state;

        let pages = [];
        for (let i = 0; i < noOfPages; i++) {
            pages.push(
                <div key={i} className="box  px-2  mx-1" onChange={() => this.handlePageChange(i + 1)}>
                    {i + 1}
                </div>
            );
        }
        return pages;
    };

    // getPages = () => {
    //     const { noOfPages } = this.state;
    //     let pages = [];
    //     for (let i = 0; i < noOfPages; i++) {
    //         pages.push(
    //             <div key={i} className="box  px-2  mx-1" onChange={() => this.handlePageChange(i + 1)}>
    //                 {i + 1}
    //             </div>
    //         );
    //     }
    //     return pages;
    // };

    handlePageChange = (page) => {
        if (page < 1) return;

        this.setState({
            pageNo: page,
        });

        setTimeout(() => {
            this.filterRestaurants();
        }, 0);
    };

    render() {
        const { mealName, selectedCityName, locationsInCity, restaurantList, pageNo } = this.state;
        let currentPage = pageNo;
        return (
            <>
                <div className="container p-5 pt-3">
                    <section className=" container  page-heading mt-2 p-0 py-2">
                        <h1>
                            {mealName} Places in {selectedCityName}
                        </h1>
                    </section>

                    <section className=" bottom-section   mt-2  ">
                        <div className="row ">
                            <div className="filter-section col-12 col-md-4 mb-2 ">
                                <div className=" filter-container  p-3">
                                    <p className="main-heading">Filters</p>
                                    <p className="sub-heading">Select Location</p>
                                    <div className="locatioBoxContainer">
                                        <select
                                            className="form-select locationBox"
                                            name="locationSelection"
                                            onChange={(event) => this.handleLocationChange(event)}
                                        >
                                            <option value="">Select location</option>
                                            {locationsInCity.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.location_id}>
                                                        {item.name}
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>

                                    <p className="sub-heading my-3">Cuisines</p>

                                    <div className="cuisines-container">
                                        <div className="form-check cuisine-item my-1">
                                            <input
                                                className="form-check-input"
                                                onChange={(event) => this.handleCuisineChange(event, "North Indian")}
                                                type="checkbox"
                                                id="northIndian"
                                            />
                                            <label className="form-check-label">North Indian</label>
                                        </div>

                                        <div className="form-check cuisine-item my-1">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                onChange={(event) => this.handleCuisineChange(event, "South Indian")}
                                            />
                                            <label className="form-check-label">South Indian</label>
                                        </div>
                                        <div className="form-check cuisine-item my-1">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                onChange={(event) => this.handleCuisineChange(event, "Chinese")}
                                            />
                                            <label className="form-check-label">Chinese</label>
                                        </div>
                                        <div className="form-check cuisine-item my-1">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                onChange={(event) => this.handleCuisineChange(event, "Fast Food")}
                                            />
                                            <label className="form-check-label">Fast Food</label>
                                        </div>
                                        <div className="form-check cuisine-item my-1">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                onChange={(event) => this.handleCuisineChange(event, "Street Food")}
                                            />
                                            <label className="form-check-label">Street Food</label>
                                        </div>
                                    </div>

                                    <p className="sub-heading my-3">Cost For Two</p>
                                    <div className="costs-container">
                                        <div className="form-check cost-item my-1">
                                            <input
                                                className="form-check-input"
                                                name="cost"
                                                type="radio"
                                                onChange={(event) => this.handleCostChange(event, 0, 500)}
                                            />
                                            <label className="form-check-label">Less than &#8377; 500</label>
                                        </div>
                                        <div className="form-check cost-item my-1">
                                            <input
                                                className="form-check-input"
                                                name="cost"
                                                type="radio"
                                                onChange={(event) => this.handleCostChange(event, 500, 1000)}
                                            />
                                            <label className="form-check-label">&#8377; 500 to &#8377; 1000</label>
                                        </div>
                                        <div className="form-check cost-item my-1">
                                            <input
                                                className="form-check-input"
                                                name="cost"
                                                type="radio"
                                                onChange={(event) => this.handleCostChange(event, 1000, 1500)}
                                            />
                                            <label className="form-check-label">&#8377; 1000 to &#8377; 1500</label>
                                        </div>
                                        <div className="form-check cost-item my-1">
                                            <input
                                                className="form-check-input"
                                                name="cost"
                                                type="radio"
                                                onChange={(event) => this.handleCostChange(event, 1500, 2000)}
                                            />
                                            <label className="form-check-label">&#8377; 1500 to &#8377; 2000</label>
                                        </div>
                                        <div className="form-check cost-item my-1">
                                            <input
                                                className="form-check-input"
                                                name="cost"
                                                type="radio"
                                                onChange={(event) => this.handleCostChange(event, 2000, 100000)}
                                            />
                                            <label className="form-check-label">&#8377; 2000+</label>
                                        </div>
                                    </div>

                                    <p className="main-heading my-3">Sort</p>
                                    <div className="form-check cost-item my-1">
                                        <input
                                            className="form-check-input"
                                            name="sort"
                                            type="radio"
                                            onChange={(event) => this.handleSortChange(event, 1)}
                                        />
                                        <label className="form-check-label">Price low to high</label>
                                    </div>
                                    <div className="form-check cost-item my-1">
                                        <input
                                            className="form-check-input"
                                            name="sort"
                                            type="radio"
                                            onChange={(event) => this.handleSortChange(event, -1)}
                                        />
                                        <label className="form-check-label">Price high to low</label>
                                    </div>
                                </div>
                            </div>

                            <div className="result-section col-12 col-md-8 mb-2 pb-0  ">
                                <div className="result-container  pb-0">
                                    {restaurantList.length > 0 ? (
                                        restaurantList.map((item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className=" result-box p-3 mb-4"
                                                    onClick={() => this.goToRestaurant(item)}
                                                >
                                                    <div className="row">
                                                        <div className="col-sm-5  col-lg-3 ">
                                                            <img
                                                                className="boxImage"
                                                                src={require(`../${item.image}`)}
                                                                alt=" not found "
                                                            />
                                                        </div>
                                                        <div className="col-sm-7  col-lg-9 ">
                                                            <h1 className="restaurant-name text-truncate ">{item.name}</h1>
                                                            <p className="locality text-truncate ">{item.locality}</p>
                                                            <p className="description text-truncate ">{item.city}</p>
                                                        </div>
                                                    </div>
                                                    <hr className="line" />
                                                    <div className="row">
                                                        <div className="col-3">
                                                            <div className="boxDescription ">CUISINES:</div>
                                                        </div>
                                                        <div className="col-9">
                                                            {item.cuisine.map((cuisine, index) => {
                                                                return <div key={index}>{cuisine.name}</div>;
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-3">
                                                            <div className="boxDescription  "> COST FOR TWO:</div>
                                                        </div>
                                                        <div className="col-9">
                                                            <div>₹ {item.min_price}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="no-results text-danger text-center my-5">No restaurants found</div>
                                    )}
                                    {restaurantList.length > 0 ? (
                                        <div className="pagination">
                                            <div className="container pb-0 d-flex flex-wrap  justify-content-center  ">
                                                <div
                                                    className="box  px-2  mx-1"
                                                    onChange={() => this.handlePageChange(--currentPage)}
                                                >
                                                    &#60;
                                                </div>
                                                {this.getPages()}
                                                <div
                                                    className="box  px-2  mx-1"
                                                    onChange={() => this.handlePageChange(++currentPage)}
                                                >
                                                    &#62;
                                                </div>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </>
        );
    }
}
export default withRouter(Filter);
