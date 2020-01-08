const express = require("express");

const { getToken } = require("../controllers/userController");
const { getPropertiesByUserId } = require("../controllers/propertyController");

const router = express.Router();

router.route("/").get(getToken, getPropertiesByUserId);

module.exports = router;
