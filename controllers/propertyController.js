const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Property = require("../models/propertyModel");

exports.getPropertiesByUserId = catchAsync(async (req, res) => {
  const id = req.userID;
  const houses = await Property.getAllPropertiesWithExtras(id);
  res.status(200).json(houses);
});

exports.getPropertyById = catchAsync(async (req, res) => {
  const property = await Property.findCompletePropertyById(req.property.id);
  res.status(200).json(property);
});

exports.deleteProperty = catchAsync(async (req, res) => {
  await Property.deleteAProperty(req.property.id);
  res.status(200).json({ message: "Property Deleted!" });
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
