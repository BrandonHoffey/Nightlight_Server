require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

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

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});