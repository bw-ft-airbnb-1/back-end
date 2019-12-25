const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/user.route");

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.send("Hello World"));

app.use("/api/v1/users", userRoutes);
module.exports = app;
