import mongoose from "mongoose";

const connectToDatabase = () => {
    mongoose
    .connect(process.env.MONGOLAB_URI as string)
        .then(() => {
            console.log("Database Connected");
        })
        .catch((err) => {
            console.error("Error connecting to database:", err);
        });
};

export default connectToDatabase;
