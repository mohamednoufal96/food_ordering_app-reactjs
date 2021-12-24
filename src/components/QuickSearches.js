import React, { Component } from "react";
import QuickSearch from "./QuickSearch";
import "../styles/QuickSearches.css";

export default class QuickSearches extends Component {
    render() {
        const { mealTypesData } = this.props;
        return (
            <section className="bottom">
                <div className="container py-5">
                    <h1 className="heading my-3   ">Quick Searches</h1>
                    <h3 className="sub-heading my-3 mb-4 text-truncate ">Discover restaurants by type of meal</h3>
                    <div className="row quick-search-boxes ">
                        {mealTypesData.map((item, index) => {
                            return (
                                <QuickSearch
                                    key={index}
                                    imageSrc={require(`../${item.image}`)}
                                    title={item.name}
                                    description={item.content}
                                    mealType={item.meal_type}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
}
