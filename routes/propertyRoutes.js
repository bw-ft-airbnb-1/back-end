const express = require("express");

const { getToken } = require("../controllers/userController");
const {
  getPropertiesByUserId,
  deleteProperty,
  validatePropertyID,
  validatePropertyRights,
  getPropertyById,
  getPropertiesOptions,
  propertyValidator,
  newProperty,
  getForeignKeys,
  editProperty
} = require("../controllers/propertyController");

const router = express.Router();
router.route("/").get(getToken, getPropertiesByUserId);

/// GETS ALL FOREIGN VALUES THAT CLIENT MIGHT NEED FOR PROPERTIES
//router.get("/getOptions", getToken, getPropertiesOptions);

/// PROPERTYBYID ROUTE {GET,EDIT,POST,DELETE}
router.get("/:propertyid", validatePropertyID, getToken, getPropertyById);
router.delete(
  "/:propertyid",
  validatePropertyID,
  getToken,
  getPropertyById,
  validatePropertyRights,
  deleteProperty
);
router.put(
  "/:propertyid",
  [getForeignKeys, ...propertyValidator],
  editProperty
);

router.post("/", [getToken, getForeignKeys, ...propertyValidator], newProperty);

module.exports = router;
