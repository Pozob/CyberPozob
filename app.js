import bot from "./bot";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log("Connected to MongoDB Database");
    bot.startUp();
}).catch(error => {
    console.log("Error while connecting to DB: " + error);
});