global.config = require(process.env.NODE_ENV === "production" ? "./config-prod.json" : "./config-dev.json");
const express = require("express");
const cors = require("cors");
const authController = require("./controllers-layer/auth-controller");
const usersController = require("./controllers-layer/users-controller");
const vacationsController = require("./controllers-layer/vacations-controller");
const followersController = require("./controllers-layer/followers-controller");
const socketLogic = require("./business-logic-layer/socket-logic");
const fileUpload = require("express-fileupload");

const server = express();

server.use(cors());
server.use(express.json());
server.use(fileUpload());

const cookie = require("cookie-parser");
server.use(cookie());

server.use("/api/auth", authController);
server.use("/api/users", usersController);
server.use("/api/vacations", vacationsController);
server.use("/api/vacations/followers", followersController);

server.use("*", (req, res) => res.status(404).send("Route not found"));

const listener = server.listen(3007, () => console.log("Listening..."));
socketLogic.start(listener);
