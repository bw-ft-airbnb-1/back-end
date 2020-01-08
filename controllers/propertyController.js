const { catchAsync } = require("../utils/catchAsync");
const Property = require("../models/propertyModel");

exports.getPropertiesByUserId = catchAsync(async (req, res) => {
  const id = req.userID;
  const houses = await Property.getAllPropertiesWithExtras(id);
  res.status(200).json(houses);
});

exports.deleteAProperty = catchAsync(async (req, res) => {
  await Property.findOneByID(req.params.id);
});
