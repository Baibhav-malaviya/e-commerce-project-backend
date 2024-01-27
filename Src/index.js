const { app } = require("./App");
const connectDb = require("./db/index");
const PORT = process.env.PORT;

connectDb()
    .then(() => {
        app.listen(PORT, () =>
            console.log("Server listening on port: " + PORT)
        );
    })
    .catch((err) => console.log("Failed to listen on port: ", err));
