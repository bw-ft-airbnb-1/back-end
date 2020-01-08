const express = require("express");
const cors = require("cors");

const userRoute = require("./routes/userRoutes");
const propertyRoute = require("./routes/propertyRoutes");
const globalErrorHandler = require("./controllers/errorController");
const AppError = require("./utils/appError");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Hello World"));
app.use("/api/v1/user", userRoute);
app.use("/api/v1/properties", propertyRoute);

app.all("*", (req, res, next) => {
  next(
    new AppError(`Can't do ${req.method} request to ${req.originalUrl}`, 404)
  );
});

app.use(globalErrorHandler);

module.exports = app;
