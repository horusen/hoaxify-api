const express = require("express");
const routes = require("./../routes");
const errorHandler = require("./utils/errorHandler");
const i18nextConfig = require("../loader/i18n.config");

const app = express();

app.use(i18nextConfig);

app.use(express.json());

app.use("/api/v1", routes);

app.use(errorHandler);

module.exports = app;
