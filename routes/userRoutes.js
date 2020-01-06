const express = require("express")

const userController = require("../controllers/userController")

const router = express.Router();

router.post("/register",userController.addUser)
router.post("/signin")

module.exports = router;