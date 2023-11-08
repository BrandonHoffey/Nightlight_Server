require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const groupController = require("./controllers/group.controller");
const userController = require("./controllers/user.controller");
const friendController = require("./controllers/friend.controller");

/* Trying Socket.io */
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
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
app.use("/friend", friendController)


app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
