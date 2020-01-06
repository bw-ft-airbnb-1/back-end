const express = require("express")
const cors = require("cors")

const userRoute = require('./routes/userRoutes')
const app = express()

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>res.send("Hello World"))
app.use("/api/v1/user",userRoute)

module.exports = app;