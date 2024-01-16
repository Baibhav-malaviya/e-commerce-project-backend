const mongoose = require("mongoose");

const { DB_NAME } = require("../constants.js");

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URL}/${DB_NAME}`
        );
        console.log("Connections: " + connectionInstance.connection.host);
    } catch (err) {
        console.log("Error in connecting to the database: " + err.message);
    }
};

module.exports = connectDb;
