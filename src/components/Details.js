import React, { Component } from "react";
import { Carousel } from "react-responsive-carousel";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import axios from "axios";
import queryString from "query-string";
import Modal from "react-modal";

import "../styles/Details.css";
import "react-tabs/style/react-tabs.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/Details-modal.css";

const API_URL = require("../constants").API_URL;

Modal.setAppElement("#root");

export default class Details extends Component {
    constructor() {
        super();
        this.state = {
            restaurant: null,
            menu: null,
            isMenuOpen: false,
            totalPrice: 0,
        };
    }

    componentDidMount() {
        const params = queryString.parse(this.props.location.search);
        const { id } = params;

        //  get the details of selected restaurant
        axios
            .get(`${API_URL}/getRestaurantById/${id}`)
            .then((resp) => {
                this.setState({
                    restaurant: resp.data.restaurant,
                });
            })
            .catch((err) => {
                console.log(err);
            });

        // get menu for the restaurant
        axios
            .get(`${API_URL}/getMenuForRestaurant/${id}`)
            .then((resp) => {
                this.setState({
                    menu: resp.data.menu,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    openMenu = () => {
        this.setState({
            isMenuOpen: true,
        });
    };

    closeMenu = () => {
        this.setState({
            isMenuOpen: false,
        });
    };

    addItemHandler = (itemPrice) => {
        const { totalPrice } = this.state;
        this.setState({
            totalPrice: totalPrice + itemPrice,
        });
    };

    isDate = (val) => {
        return Object.prototype.toString.call(val) === "[object Date]";
    };

    isObj = (val) => {
        return typeof val === "object";
    };

    stringifyValue = (value) => {
        if (this.isObj(value) && !this.isDate(value)) {
            return JSON.stringify(value);
        } else {
            return value;
        }
    };

    buildForm = (details) => {
        const { action, params } = details;
        const form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", action);
        Object.keys(params).forEach((key) => {
            const input = document.createElement("input");
            input.setAttribute("type", "hidden");
            input.setAttribute("name", key);
            input.setAttribute("value", this.stringifyValue(params[key]));
            form.appendChild(input);
        });
        return form;
    };

    postTheInformationToPaytm = (info) => {
        // build the form data
        const form = this.buildForm(info);

        // attach in the request body
        document.body.appendChild(form);

        // submit the form
        form.submit();

        // destroy the form
        form.remove();
    };

    getChecksum = (data) => {
        return fetch(`${API_URL}/payment`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((resp) => {
                return resp.json();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    paymentHandler = () => {
        // add the logic to make the payment

        // (1) make API call to the BE and get the payment checksum
        const data = {
            amount: this.state.totalPrice,
            email: "mohamed_noufal@gmail.com",
            mobileNo: "9999999999",
        };

        this.getChecksum(data)
            .then((result) => {
                // (2) go to the paytm website, on the paytm website, finish the payment
                let information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: result,
                };
                this.postTheInformationToPaytm(information);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    render() {
        const { restaurant, menu, isMenuOpen, totalPrice } = this.state;
        return (
            <div className="detailsPage-container">
                <div className="details container">
                    {restaurant ? (
                        <>
                            <div className="images">
                                <Carousel showThumbs={false}>
                                    {restaurant.thumb.map((item, index) => {
                                        return (
                                            <div>
                                                <img
                                                    className="carousel-img"
                                                    key={index}
                                                    src={require(`../${item}`)}
                                                    alt="not found"
                                                />
                                            </div>
                                        );
                                    })}
                                </Carousel>
                            </div>

                            <h1 className="restaurant-name mt-5">{restaurant.name}</h1>
                            <div className="button-container d-flex justify-content-end">
                                <button className="btn btn-danger" onClick={this.openMenu}>
                                    Place Online Order
                                </button>
                            </div>
                            <div className="tabs-container">
                                <Tabs>
                                    <TabList>
                                        <Tab>Overview</Tab>
                                        <Tab>Contact</Tab>
                                    </TabList>

                                    <TabPanel>
                                        <h2 className="title my-4">About this place</h2>

                                        <div className="my-4">
                                            <p className="desc-title mb-2 ">Cuisine</p>
                                            {restaurant.cuisine.map((item, index) => {
                                                return (
                                                    <p className="desc-text " index={index}>
                                                        {item.name}
                                                    </p>
                                                );
                                            })}
                                        </div>

                                        <div className="my-4">
                                            <p className="desc-title mb-2 ">Average Cost</p>
                                            <p className="desc-text ">₹ {restaurant.min_price} for two people (approx.)</p>
                                        </div>
                                    </TabPanel>
                                    <TabPanel>
                                        <div className="my-4">
                                            <p className="phone-title mb-2">Phone Number</p>
                                            <p className="phone">+{restaurant.contact_number} </p>
                                        </div>
                                        <div className="my-4">
                                            <p className="address-title mb-2">{restaurant.name}</p>
                                            <p className="address-text">
                                                {restaurant.locality}
                                                <br />
                                                {restaurant.city}
                                            </p>
                                        </div>
                                    </TabPanel>
                                </Tabs>
                            </div>
                            <Modal isOpen={isMenuOpen}>
                                <div className="modal-content">
                                    <div className="d-flex justify-content-between align-items-center my-2">
                                        <h2 className="heading">Menu</h2>
                                        <h2 className="d-flex justify-content-end">
                                            <button
                                                className="close-button btn btn-outline-danger justify-self-end"
                                                onClick={this.closeMenu}
                                            >
                                                X
                                            </button>
                                        </h2>
                                    </div>
                                    <h4 className="restaurant-name my-1">{restaurant.name}</h4>
                                    <ul className="menu">
                                        {menu
                                            ? menu.map((item, index) => {
                                                  return (
                                                      <li key={index} className="menu-item my-2">
                                                          <div className="row">
                                                              <div className="col-8">
                                                                  <div className="item-info item-name">{item.itemName}</div>

                                                                  {item.isVeg ? (
                                                                      <div className="item-info text-success">Veg</div>
                                                                  ) : (
                                                                      <div className=" item-info text-danger ">Non-veg</div>
                                                                  )}
                                                                  <div className="item-info">{item.itemDescription}</div>
                                                              </div>

                                                              <div className="item-info col-2">
                                                                  &#8377; {item.itemPrice}
                                                              </div>
                                                              <div className="col-2">
                                                                  <button
                                                                      className="add-button btn btn-light"
                                                                      onClick={() => this.addItemHandler(item.itemPrice)}
                                                                  >
                                                                      Add
                                                                  </button>
                                                              </div>
                                                          </div>
                                                      </li>
                                                  );
                                              })
                                            : null}
                                    </ul>

                                    <div className="my-3 d-flex justify-content-between align-items-center my-2">
                                        <h4 className="subtotal">Subtotal : &#8377; {totalPrice}</h4>
                                        <button
                                            className="payNow-button btn btn-success"
                                            onClick={() => this.paymentHandler()}
                                        >
                                            Pay now
                                        </button>
                                    </div>
                                </div>
                            </Modal>
                        </>
                    ) : (
                        <div>
                            <h3 className="loading text-center">Loading.... Please wait</h3>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
