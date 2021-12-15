import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";
import GoogleLogin from "react-google-login";
import { FacebookProvider, LoginButton } from "react-facebook";

import "../styles/Header.css";
const modalStyle = {
    content: {
        top: "50%",
        left: "50%",
        margin: "auto",
        transform: "translate(-50%, -50%)",
        width: "600px",
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
            signUpError: undefined,
        };
    }
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

    loginHandler = () => {
        const { username, password } = this.state;
        const req = {
            username,
            password,
        };
        axios({
            method: "POST",
            url: `${API_URL}/login`,
            headers: { "Content-Type": "application/json" },
            data: req,
        })
            .then((result) => {
                const { user } = result.data;
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("isLoggedIn", true);
                this.setState({
                    user: user,
                    isLoggedIn: true,
                    logginError: false,
                    isLoginModalOpen: false,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    isLoggedIn: false,
                    logginError: "username or pasword is wrong, please try again",
                });
            });
    };

    cancelLoginHandler = () => {
        this.closeLoginModal();
    };

    signupHandler = () => {
        const { username, password, firstName, lastName } = this.state;
        const req = {
            username,
            password,
            firstName,
            lastName,
        };
        axios({
            method: "POST",
            url: `${API_URL}/signup`,
            headers: { "Content-Type": "application/json" },
            data: req,
        })
            .then((result) => {
                const { user } = result.data;
                localStorage.setItem("user", JSON.stringify(user));
                localStorage.setItem("isLoggedIn", true);
                this.setState({
                    user: user,
                    isLoggedIn: true,
                    signUpError: false,
                    isSignupModalOpen: false,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    isLoggedIn: false,
                    signUpError: "error while sign up",
                });
            });
    };

    cancelSignupHandler = () => {
        this.closeSignupModal();
    };

    logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        this.setState({
            user: undefined,
            isLoggedIn: false,
        });
    };

    handleChange = (event, field) => {
        const value = event.target.value;
        this.setState({
            [field]: value,
            logginError: undefined,
            SignUpError: undefined,
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

    googleLoginHandler = (event) => {};
    googleSignupHandler = (event) => {};

    handleFacebookResponse = (event) => {};

    handleFacebookError = (event) => {};

    render() {
        const {
            backgroundStyle,
            isLoginModalOpen,
            isSignupModalOpen,
            isLoggedIn,
            user,
            username,
            password,
            firstName,
            lastName,
            logginError,
            signUpError,
        } = this.state;
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
                                <span className="text-white mx-3">{user.firstName}</span>
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
                        <form className="login-form">
                            {logginError ? <div className="alert alert-danger text-center my-3">{logginError}</div> : null}
                            <div className="email my-2">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Email"
                                    required
                                    value={username}
                                    onChange={(event) => this.handleChange(event, "username")}
                                />
                            </div>
                            <div className="password my-2">
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(event) => this.handleChange(event, "password")}
                                />
                            </div>
                            <div className="login-buttons text-center my-3">
                                <input
                                    type="button"
                                    className="btn btn-primary mx-3 "
                                    onClick={this.loginHandler}
                                    value="Login"
                                />
                                <button className="btn btn-dark mx-3" onClick={this.closeLoginModal}>
                                    Cancel
                                </button>
                            </div>
                            <div className="facebook-login my-2">
                                <FacebookProvider appId="2717842315186650">
                                    <LoginButton
                                        scope="email"
                                        onCompleted={this.handleFacebookResponse}
                                        onError={this.handleFacebookError}
                                    >
                                        <div className="facebook-login-content ">Login with facebook</div>
                                    </LoginButton>
                                </FacebookProvider>
                            </div>
                            <div className="google-login my-2">
                                <GoogleLogin
                                    clientId="147405619169-v9rkihjtmmmr2l71e810ri509799fctd.apps.googleusercontent.com"
                                    buttonText="Continue with google"
                                    onSuccess={this.googleLoginHandler}
                                    onFailure={this.googleLoginHandler}
                                    cookiePolicy={"single_host_origin"}
                                />
                            </div>
                        </form>
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
                        <form className="signUp-form">
                            {signUpError ? <div className="alert alert-danger text-center my-3">{signUpError}</div> : null}
                            <div className="firstName my-2">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="First name"
                                    required
                                    value={firstName}
                                    onChange={(event) => this.handleChange(event, "firstName")}
                                />
                            </div>
                            <div className="lastName my-2">
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Last name"
                                    required
                                    value={lastName}
                                    onChange={(event) => this.handleChange(event, "lastName")}
                                />
                            </div>
                            <div className="email my-2">
                                <input
                                    className="form-control"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={username}
                                    onChange={(event) => this.handleChange(event, "username")}
                                />
                            </div>
                            <div className="password my-2">
                                <input
                                    className="form-control"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(event) => this.handleChange(event, "password")}
                                />
                            </div>
                            <div className="signUp-buttons text-center my-3">
                                <input
                                    type="button"
                                    className=" btn btn-primary mx-3 "
                                    value="Sign Up"
                                    onClick={this.signupHandler}
                                />
                                <button className="btn btn-dark mx-3" onClick={this.closeSignupModal}>
                                    Cancel
                                </button>
                            </div>
                            <div className="facebook-login my-2">
                                <FacebookProvider appId="2717842315186650">
                                    <LoginButton
                                        scope="email"
                                        onCompleted={this.handleFacebookResponse}
                                        onError={this.handleFacebookError}
                                    >
                                        <div className="facebook-login-content">Login with facebook</div>
                                    </LoginButton>
                                </FacebookProvider>
                            </div>
                            <div className="google-login my-2">
                                <GoogleLogin
                                    clientId="147405619169-v9rkihjtmmmr2l71e810ri509799fctd.apps.googleusercontent.com"
                                    buttonText="Continue with google"
                                    onSuccess={this.googleSignupHandler}
                                    onFailure={this.googleSignupHandler}
                                    cookiePolicy={"single_host_origin"}
                                />
                            </div>
                        </form>
                    </div>
                </Modal>
            </header>
        );
    }
}
export default withRouter(Header);
