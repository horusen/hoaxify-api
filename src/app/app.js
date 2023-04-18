const express = require("express");
const routes = require("./../routes");
const errorHandler = require("./utils/errorHandler");

const app = express();

app.use(express.json());

app.use("/api/v1", routes);

app.use(errorHandler);

module.exports = app;
