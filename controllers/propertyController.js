const { check, validationResult } = require("express-validator");
const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Property = require("../models/propertyModel");
const faker = require("faker");

exports.getPropertiesByUserId = catchAsync(async (req, res) => {
  const id = req.userID;
  const houses = await Property.getAllPropertiesWithExtras(id);
  res.status(200).json(houses);
});

exports.getPropertyById = catchAsync(async (req, res) => {
  const property = await Property.findCompletePropertyById(req.property.id);
  res.status(200).json(property);
});

exports.newProperty = catchAsync(async (req, res, next) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return next(new AppError(err.errors, 401));
  }
  if (!req.body.image) {
    req.body.image = faker.image.image();
  }
  const {
    minimum_nights,
    bedrooms,
    bathrooms,
    security_deposit,
    zip_code,
    accommodates,
    image,
    price
  } = req.body;

  const property = {
    ...req.types,
    minimum_nights,
    bedrooms,
    bathrooms,
    security_deposit,
    zip_code,
    accommodates,
    image,
    price,
    user_id: req.userID
  };

  const amenities = req.amenities;
  const newProperty = await Property.createProperty(property, amenities);
  return res.status(200).json(newProperty);
});

exports.editProperty = catchAsync(async (req, res) => {
  const err = validationResult(req);
  if (!err.isEmpty()) {
    return next(new AppError(err.errors, 401));
  }
  if (!req.body.image) {
    req.body.image = faker.image.image();
  }
  const {
    id,
    minimum_nights,
    bedrooms,
    bathrooms,
    security_deposit,
    zip_code,
    accommodates,
    image,
    price
  } = req.body;

  const property = {
    id,
    ...req.types,
    minimum_nights,
    bedrooms,
    bathrooms,
    security_deposit,
    zip_code,
    accommodates,
    image,
    price,
    user_id: req.userID
  };

  const amenities = req.amenities;
  const newProperty = await Property.createProperty(property, amenities);
  return res.status(200).json(newProperty);

});

/// DELETES PROPERTY BY PROPERTY ID
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
  console.log("id",req.property.id)
  console.log("id",req.userID)

  if (req.property.id !== req.userID) {
    throw new AppError("Not Authorized", 403);
  }
  next();
};

exports.propertyValidator = [
  check("minimum_nights")
    .isInt([{ gt: 0, lt: 31 }])
    .withMessage("Enter minimum nights 0 - 31"),
  check("bedrooms")
    .isInt([{ gt: 1, lt: 12 }])
    .withMessage("Enter number of bedrooms 1 - 12"),
  check("bathrooms")
    .isInt([{ gt: 1, lt: 6 }])
    .withMessage("Enter number of bedrooms 1 - 6"),
  check("security_deposit")
    .isInt([{ gt: 1, lt: 1500 }])
    .withMessage("Enter security deposit 1 - 1500"),
  check("zip_code")
    .isInt([{ gt: 10000, lt: 99999 }])
    .withMessage("Enter a valid zip code"),
  check("accommodates")
    .isInt([{ gt: 1, lt: 13 }])
    .withMessage("Enter accommodates 1 - 13"),
  check("price")
    .isInt()
    .withMessage("Please provide the price provided by ds")
];

exports.getForeignKeys = catchAsync(async (req, res, next) => {
  const { bed_type, room_type, property_type, amenities } = req.body;
  if (typeof amenities !== "object") {
    return next(new AppError("Please provide amenities"));
  }
  if (!bed_type || !room_type || !property_type) {
    return next(
      new AppError("Please provide bed_types, room_types, and property_types")
    );
  }
  if (Object.keys(amenities).length != 0) {
    const amenitiesRes = await Property.checkAmenities(amenities);
    req.amenities = amenitiesRes;
  }

  const typesObj = await Property.checkTypes({
    bed_type,
    room_type,
    property_type
  });
  req.types = typesObj;
  next();
});
