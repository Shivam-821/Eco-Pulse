import mongoose from "mongoose";

const connectDB = async function(){
    try {
        const connectionInstance = await mongoose.connect(
          `${process.env.MONGODB_URI}`
        );
        console.log(`MongoDB connected successfully: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("Error connecting to DB at db/db.js :: ERROR ::  ", error)
        process.exit(1);
    }
}

export default connectDB;