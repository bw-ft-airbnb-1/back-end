const express = require("express");

const { getToken } = require("../controllers/userController");
const {
  getPropertiesByUserId,
  deleteProperty,
  validatePropertyID,
  validatePropertyRights,
  getPropertyById
} = require("../controllers/propertyController");

const router = express.Router();
router.route("/").get(getToken, getPropertiesByUserId);

router
  .route("/:propertyid")
  .all(validatePropertyID, getToken)
  .get(getPropertyById)
  .all(validatePropertyRights)
  .delete(deleteProperty);

module.exports = router;
