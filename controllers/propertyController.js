const { catchAsync } = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Property = require("../models/propertyModel");
const { check, validationResult } = require("express-validator");
const faker = require("faker");

/// GET PROPERTY BY PROPERTY ID - RETURNS PROPERTY WITH ALL OPTIONS
exports.getPropertyById = catchAsync(async (req, res) => {
  const property = req.property;
  const amenities = await Property.findAllAmenitiesForProperties(property.id);
  property.amenities = amenities;
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
    optimal_price,
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
    optimal_price,
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
    optimal_price,
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
    optimal_price,
    price,
    user_id: req.userID
  };

  const amenities = req.amenities;
  const newProperty = await Property.editAProperty(property, amenities);
  return res.status(200).json(newProperty);
});

/// DELETES PROPERTY BY PROPERTY ID
exports.deleteProperty = catchAsync(async (req, res) => {
  await Property.deleteAProperty(req.property.id);
  res.status(200).json({ message: "Property Deleted!" });
});

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
