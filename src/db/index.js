import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const ConnectDB = async () => {
    try {
        console.log(">> MONGODB_URI from env:", process.env.MONGODB_URI);
console.log(">> Final URI:", `${process.env.MONGODB_URI}/${DB_NAME}`);

        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(
            `MongoDB Connected! DB Host: ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.log("MONGODB Connection Error", error);
        process.exit(1);
    }
};

export default ConnectDB;
