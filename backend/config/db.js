import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async function(){
    try {
        const connectionInstance = await mongoose.connect(
          `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(`MongoDB connected successfully: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("Error connecting to DB at db/db.js :: ERROR ::  ", error)
        process.exit(1);
    }
}

export default connectDB;