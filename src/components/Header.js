import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";

import "../styles/Header.css";
const modalStyle = {
    content: {
        top: "50%",
        left: "50%",
        margin: "auto",
        transform: "translate(-50%, -50%)",
        width: "800px",
        background: "white",
        zIndex: "10000000",
    },
};

const API_URL = require("../constants").API_URL;

Modal.setAppElement("#root");

class Header extends Component {
    constructor(state) {
        super();
        this.state = {
            backgroundStyle: "",
            isLoginModalOpen: false,
            isSignupModalOpen: false,
            username: "",
            password: "",
            firstName: "",
            lastName: "",
            user: undefined,
            isLoggedIn: false,
            logginError: undefined,
            SignUpError: undefined,
        };
    }

    openLoginModal = () => {
        this.setState({
            isLoginModalOpen: true,
        });
    };

    closeLoginModal = () => {
        this.setState({
            isLoginModalOpen: false,
        });
    };

    openSignupModal = () => {
        this.setState({
            isSignupModalOpen: true,
        });
    };

    closeSignupModal = () => {
        this.setState({
            isSignupModalOpen: false,
        });
    };

    loginHandler = () => {};

    cancelLoginHandler = () => {
        this.closeLoginModal();
    };

    signupHandler = () => {};

    cancelSignupHandler = () => {
        this.closeSignupModal();
    };

    logoutHandler = () => {};

    componentDidMount = () => {
        console.log("running");
        let initialPath = this.props.history.location.pathname;
        // console.log(this.initialPath);
        this.setHeaderStyle(initialPath);

        this.props.history.listen((location, action) => {
            let path = location.pathname;
            // console.log(this.path);
            this.setHeaderStyle(path);
        });
    };

    setHeaderStyle = (path) => {
        let bg = "";
        if (path === "/" || path === "/home") {
            bg = "transparent";
        } else {
            bg = "coloured";
        }
        this.setState({
            backgroundStyle: bg,
        });
    };

    navigate = (path) => {
        this.props.history.push(path);
    };

    transparentHeader = {
        position: "absolute",
        background: "transparent",
        zIndex: "10",
    };
    render() {
        const { backgroundStyle, isLoginModalOpen, isSignupModalOpen, isLoggedIn, user } = this.state;
        return (
            <header className="zomato-header  " style={backgroundStyle === "transparent" ? this.transparentHeader : null}>
                <div className="container  py-3 d-flex justify-content-between align-items-center  ">
                    {backgroundStyle === "transparent" ? null : (
                        <div className="logo py-0 px-2" onClick={() => this.navigate("/home")}>
                            e!
                        </div>
                    )}

                    <div className="header-buttons text-end ">
                        {isLoggedIn ? (
                            <>
                                <span className="text-white">{user.firstName}</span>
                                <button
                                    className="create-button btn-outline-light bg-transparent"
                                    onClick={this.logoutHandler}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    className=" login-button btn-outline-light border-0 bg-transparent mx-3 "
                                    onClick={this.openLoginModal}
                                >
                                    Login
                                </button>
                                <button
                                    className="create-button btn-outline-light bg-transparent"
                                    onClick={this.openSignupModal}
                                >
                                    Create an Account
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <Modal isOpen={isLoginModalOpen} style={modalStyle}>
                    <div className="loginModal-content">
                        <div className="d-flex justify-content-between align-items-center my-2">
                            <h2 className="heading">Login</h2>
                            <h2 className="d-flex justify-content-end">
                                <button
                                    className="close-button btn btn-outline-danger justify-self-end"
                                    onClick={this.closeLoginModal}
                                >
                                    X
                                </button>
                            </h2>
                        </div>
                    </div>
                </Modal>
                <Modal isOpen={isSignupModalOpen} style={modalStyle}>
                    <div className="signupModal-content">
                        <div className="d-flex justify-content-between align-items-center my-2">
                            <h2 className="heading">Signup</h2>
                            <h2 className="d-flex justify-content-end">
                                <button
                                    className="close-button btn btn-outline-danger justify-self-end"
                                    onClick={this.closeSignupModal}
                                >
                                    X
                                </button>
                            </h2>
                        </div>
                    </div>
                </Modal>
            </header>
        );
    }
}
export default withRouter(Header);
