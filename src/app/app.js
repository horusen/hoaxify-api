const express = require("express");
const { registerUser } = require("./auth/registration/registration.controller");

const app = express();

app.use(express.json());

app.post("/api/v1/users", registerUser);

module.exports = app;
