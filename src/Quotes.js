import React from "react";
import "./App.css";
import { quoteData } from "./data";

const getRandomInt = (min=0, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export const Quotes = () => {
    let randomIndex = getRandomInt(0, quoteData.length)
    let selectedQuote = quoteData[randomIndex];
    return (
        <>
            <h1> Get a quote here !! </h1>
            <div className="quote-container">
                {selectedQuote.quote + "  @" + selectedQuote.author}
            </div>
        </>
    );
};
