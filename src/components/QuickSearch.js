import React, { Component } from "react";
import { withRouter } from "react-router-dom";

class QuickSearch extends Component {
    goToFilterPage = () => {
        this.props.history.push(`/filter?mealName=${this.props.title}&mealType=${this.props.mealType}`);
    };
    render() {
        const { imageSrc, title, description } = this.props;

        return (
            <div className="col-md-6 col-xl-4  mb-4">
                <div className="box" onClick={this.goToFilterPage}>
                    <img src={imageSrc} alt="not available" />
                    <div>
                        <p className="heading">{title}</p>
                        <p className="description"> {description}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(QuickSearch);
