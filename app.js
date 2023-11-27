require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const groupController = require("./controllers/group.controller");
const userController = require("./controllers/user.controller");
const messageController = require("./controllers/message.controller");
const friendController = require("./controllers/friend.controller");
const socketController = require("./controllers/socket.controller");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  socketController(io, socket);
});

const PORT = process.env.PORT;
const DB_NAME = process.env.DB_NAME;
const DB_URL = process.env.DB_URL;

// ! Connect To Cluster Database
mongoose.connect(DB_URL);
const db = mongoose.connection;
db.once("open", () => {
  console.log(`Connected to the DB: ${DB_NAME}`);
});

// ! Connect Our Routes
app.use(cors());
app.use(express.json());
app.use("/group", groupController);
app.use("/user", userController);
app.use("/message", messageController);
app.use("/friend", friendController);

server.listen(PORT, () => {
  console.log(`Socket and HTTP server running on Port: ${PORT}`);
});
