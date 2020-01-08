const express = require("express");

const { getToken } = require("../controllers/userController");
const {
  getPropertiesByUserId,
  deleteAProperty
} = require("../controllers/propertyController");

const router = express.Router();

router.route("/").get(getToken, getPropertiesByUserId);
router.route("/:id").delete(getToken, deleteAProperty);

module.exports = router;
