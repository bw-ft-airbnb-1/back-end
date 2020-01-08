const express = require("express");

const { getToken } = require("../controllers/userController");
const {
  deleteProperty,
  validatePropertyID,
  validatePropertyRights,
  getPropertyById,
  getPropertiesOptions
} = require("../controllers/propertyController");

const router = express.Router();

router.get("/getOptions", getToken, getPropertiesOptions);

// router
//   .route("/:propertyid")
//   .all(validatePropertyID, getToken)
//   .get(getPropertyById)
//   .all(validatePropertyRights)
//   .delete(deleteProperty);

module.exports = router;
