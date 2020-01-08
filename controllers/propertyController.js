const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Property = require("../models/propertyModel");

/// GET PROPERTY BY PROPERTY ID - RETURNS PROPERTY WITH ALL OPTIONS
exports.getPropertyById = catchAsync(async (req, res) => {
  const property = req.property;
  const amenities = await Property.findAllAmenitiesForProperties(property.id);
  property.amenities = amenities;
  res.status(200).json(property);
});

// /// GET ALL PROPERTIES BY USER ID - RETURNS PROPERTIES WITH AMENITIES AND PHOTOS
// exports.getPropertiesByUserId = catchAsync(async (req, res) => {
//   const id = req.userID;
//   const houses = await Property.getAllPropertiesWithExtras(id);
//   res.status(200).json(houses);
// });

/// DELETES PROPERTY BY PROPERTY ID
exports.deleteProperty = catchAsync(async (req, res) => {
  await Property.deleteAProperty(req.property.id);
  res.status(200).json({ message: "Property Deleted!" });
});

/// EDIT PROPERTY BY PROPERTY ID
// exports.editProperty = catchAsync(async (req, res) => {
//   await Property.deleteAProperty(req.property.id);
//   res.status(200).json({ message: "Property Deleted!" });
// });

/// SENDS ALL OPTIONS FOR DIFFERENT PROPERTY RELATIONS THAT CLIENT MIGHT NEED
exports.getPropertiesOptions = catchAsync(async (req, res) => {
  const propertyOptions = await Property.findPropertiesOptions();
  res.status(200).json(propertyOptions);
});

/////////
/////////
////////
////////

//// MIDDLEWARE
exports.validatePropertyID = catchAsync(async (req, res, next) => {
  const propertyId = Number(req.params.propertyid);
  if (isNaN(propertyId)) {
    throw new AppError("Could not find a property with that ID", 401);
  }
  const property = await Property.findPropertyById(propertyId);
  if (!property) {
    throw new AppError("Could not find a property with that ID", 401);
  }
  req.property = property;
  next();
});

exports.validatePropertyRights = (req, res, next) => {
  if (req.property.ownerId !== req.userID) {
    throw new AppError("Not Authorized", 403);
  }
  next();
};
