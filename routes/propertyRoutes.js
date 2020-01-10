const express = require("express");

const { getToken } = require("../controllers/userController");
const {
  deleteProperty,
  validatePropertyID,
  validatePropertyRights,
  getPropertyById,
  getPropertiesOptions,
  getForeignKeys,
  propertyValidator,
  newProperty,
  editProperty
} = require("../controllers/propertyController");

const router = express.Router();

/// GETS ALL FOREIGN VALUES THAT CLIENT MIGHT NEED FOR PROPERTIES - NOT USED
router.get("/getOptions", getToken, getPropertiesOptions);

/// PROPERTYBYID ROUTE {GET,EDIT,POST,DELETE}
router
  .route("/:propertyid")
  .all(validatePropertyID, getToken)
  .get(getPropertyById)
  .delete(deleteProperty);

router.post("/", [getToken, getForeignKeys, ...propertyValidator], newProperty);
router.put(
  "/:propertyid",
  [getToken, validatePropertyID, getForeignKeys, ...propertyValidator],
  editProperty
);

module.exports = router;
