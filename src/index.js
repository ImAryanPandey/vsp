// require("dotenv").config({path: "./env"});

import dotenv from "dotenv";
import ConnectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({ path: "./.env" });

ConnectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("ERR:", error);
        throw error
    })
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is Running at Port : ${process.env.PORT}`);
    })
})
.catch((err) => {console.log("Mongo DB Connection Failed", err)});











/*

import express from "express";
const app = express();

(async () => {
    try {
        mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.error("ERROR: ", error);
            throw error;
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is Listening on Port ${process.env.PORT}`);
        })

    } catch (error) {
        console.error("ERROR: ", error);
        throw error;
    }
})()

*/

