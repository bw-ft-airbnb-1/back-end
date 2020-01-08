const { catchAsync } = require("../utils/catchAsync");
const Property = require("../models/propertyModel");

// exports.getPropertiesByUserId = catchAsync(async (req,res) => {
//   const id = req.userID;
//   const houses = await Property.getAllPropertiesByUserId(id)
//   res.status(200).json(houses)
// })

exports.getPropertiesByUserId = catchAsync(async (req, res) => {
  const id = req.userID;
  const houses = await Property.getAllPropertiesWithExtras(id);
  console.log(houses)
  res.status(200).json(houses);
});
