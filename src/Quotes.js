import React from "react";
import "./App.css";
import { BlobServiceClient } from "@azure/storage-blob"
import { useState } from 'react';
import { Buffer } from 'buffer';

window.Buffer = Buffer;

const getRandomInt = (min=0, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

const getQuotes = async () => {
    const account = process.env.REACT_APP_STORAGE_ACCOUNT;
    const sas = process.env.REACT_APP_STORAGE_SAS;
    console.log('account: %s', account)
    console.log('sas: %s', sas)
    let connString = 'https://' + account + '.blob.core.windows.net?' + sas;
    const blobServiceClient = new BlobServiceClient(connString);
    const container = process.env.REACT_APP_STORAGE_CONTAINER;
    const fileName = process.env.REACT_APP_QUOTES_FILENAME

    const containerClient = blobServiceClient.getContainerClient(container);
    const blobClient = containerClient.getBlockBlobClient(fileName);

    const downloadBlockBlobResponse = await blobClient.download(0);
    const downloadedContent = await streamToString(downloadBlockBlobResponse.readableStreamBody);

    const quoteData = JSON.parse(downloadedContent)

    return quoteData.quotes
};

const streamToString = async (readableStream) => {
    const chunks = [];
    for await (const chunk of readableStream) {
    chunks.push(chunk);
    }
    return new TextDecoder().decode(new Uint8Array(chunks.flat()));
};


export const Quotes = () => {
    const [quoteDetail, setQuoteDetail] = useState(undefined);
    const [showDiv, setShowDiv] = useState(false);

    const getQuote = async () => {
        var quoteData = getQuotes();
        let randomIndex = getRandomInt(0, quoteData.length)
        let selectedQuote = quoteData[randomIndex];
        setQuoteDetail(selectedQuote)
        setShowDiv(true);
    }

    return (
        <>
            <h1> Get a quote here !! </h1>
            <button onClick= {getQuote}>Get Quote</button>
            {showDiv && <div className="quote-container">
                {quoteDetail?.quote + "  @" + quoteDetail?.author}
            </div>}
        </>
    );
};
