require("dotenv").config();

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
const mongoString = process.env.DATABASE_URL || "";

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on("error", (error: Error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});
const app = express();

// routes
const userRoutes = require("./routes/user");

app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);

app.listen(3030, () => {
  console.log(`Server Started at ${3030}`);
});
