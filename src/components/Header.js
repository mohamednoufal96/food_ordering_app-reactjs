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
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "430px",
        background: "white",
        zIndex: "100",
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
            loginError: undefined,
            signUpError: undefined,
        };
    }
    componentDidMount = () => {
        let initialPath = this.props.history.location.pathname;
        this.setHeaderStyle(initialPath);

        this.props.history.listen((location, action) => {
            let path = location.pathname;
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
                    logginError: "Incorrect username or password",
                });
            });
    };

    cancelLoginHandler = () => {
        this.closeLoginModal();
    };

    signUpHandler = () => {
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
                    signUpError: undefined,
                    isSignupModalOpen: false,
                });
            })
            .catch((err) => {
                console.log(err);
                this.setState({
                    isLoggedIn: false,
                    signUpError: "Error Signing Up",
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
        const val = event.target.value;
        this.setState({
            [field]: val,
            loginError: undefined,
            signUpError: undefined,
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

    googleLoginHandler = (event) => {
        debugger;
        let userDetails = event.profileObj;
        const { email, givenName, name } = userDetails;

        this.setState({
            firstName: givenName,
            lastName: name,
            email: email,
        });
        const { firstName, lastName, username } = this.state;
        const userData = {
            firstName,
            lastName,
            username,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", true);
        this.setState({
            user: userData,
            isLoggedIn: true,
            loginError: undefined,
            isLoginModalOpen: false,
        });
    };

    googleSignupHandler = (event) => {
        let userDetails = event.profileObj;
        const { email, givenName, name } = userDetails;

        this.setState({
            firstName: givenName,
            lastName: name,
            username: email,
        });
        const { firstName, lastName, username } = this.state;
        const userData = {
            firstName,
            lastName,
            username,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", true);
        this.setState({
            user: userData,
            isLoggedIn: true,
            loginError: undefined,
            isSignupModalOpen: false,
        });
    };

    handleFacebookResponse = (event) => {
        debugger;
        let userDetails = event.profile;
        const { email, first_name, last_name } = userDetails;

        this.setState({
            firstName: first_name,
            lastName: last_name,
            username: email,
        });
        const { firstName, lastName, username } = this.state;
        const userData = {
            firstName,
            lastName,
            username,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", true);
        this.setState({
            user: userData,
            isLoggedIn: true,
            loginError: undefined,
            isLoginModalOpen: false,
        });
    };

    handleFacebookError = (event) => {
        debugger;
        this.setState({
            isLoggedIn: false,
            signUpError: "Facebook login error",
        });
    };

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
                                <span className="header-userName text-white mx-3">{user.firstName}</span>
                                <button className="create-button btn-outline-light bg-transparent" onClick={this.logout}>
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
                            <div className="login-content">
                                <input
                                    className="form-control my-2"
                                    type="text"
                                    placeholder="Email"
                                    required
                                    value={username}
                                    onChange={(event) => this.handleChange(event, "username")}
                                />
                                <input
                                    className="form-control my-2"
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(event) => this.handleChange(event, "password")}
                                />
                            </div>

                            <div className="login-signup-buttons text-center my-3">
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
                            <div className="signUp-content">
                                <input
                                    className="form-control my-2"
                                    type="text"
                                    placeholder="First name"
                                    required
                                    value={firstName}
                                    onChange={(event) => this.handleChange(event, "firstName")}
                                />
                                <input
                                    className="form-control my-2"
                                    type="text"
                                    placeholder="Last name"
                                    required
                                    value={lastName}
                                    onChange={(event) => this.handleChange(event, "lastName")}
                                />
                                <input
                                    className="form-control my-2"
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={username}
                                    onChange={(event) => this.handleChange(event, "username")}
                                />
                                <input
                                    className="form-control my-2"
                                    type="text"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(event) => this.handleChange(event, "password")}
                                />
                            </div>

                            <div className="login-signup-buttons text-center my-3">
                                <input
                                    type="button"
                                    className=" btn btn-primary mx-3 "
                                    onClick={this.signUpHandler}
                                    value="Sign Up"
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
