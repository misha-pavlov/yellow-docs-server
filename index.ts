require("dotenv").config();

import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";

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
const documentRoutes = require("./routes/document");
const templatesRoutes = require("./routes/templates");
const userSettingsRoutes = require("./routes/userSettings");

app.use(cors());
app.use(express.json());
app.use("/user", userRoutes);
app.use("/document", documentRoutes);
app.use("/templates", templatesRoutes);
app.use("/userSettings", userSettingsRoutes);

// get the list of routes
const routes = listEndpoints(app);

// print the list of routes
console.log("Routes:", routes);

app.listen(3030, () => {
  console.log(`Server Started at ${3030}`);
});
