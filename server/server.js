// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const sessionConfig = require("./session.config"); 

const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
const CLIENT_URL = "http://localhost:3000";
const port = 8000;

mongoose.connect(MONGO_URL);

const app = express();

app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
    })
);

app.use(session(sessionConfig));
app.use(express.json());

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const voteController = require("./controller/vote");

const userController = require("./controller/user");
const commentController = require("./controller/comment");

app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/vote", voteController);
app.use("/user", userController);
app.use("/comment", commentController);

let server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close();
    mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
});

module.exports = server
