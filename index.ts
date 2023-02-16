require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error: Error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
const app = express();
const routes = require("./routes/routes");

app.use(express.json());
app.use("/api", routes);

app.listen(3030, () => {
  console.log(`Server Started at ${3030}`);
});
