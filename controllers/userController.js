const User = require("../models/userModel");

exports.addUser = async (req, res) => {
  const userBody = req.body;
  console.log(userBody);
  if (!userBody) {
    return res.status(403).json({ error: "Please provide user information" });
  }
  if (!userBody.name || !userBody.email) {
    return res
      .status(403)
      .json({ error: "Missing name, email or password field" });
  }
  const nameArr = userBody.name.split(" ");
  userBody.first_name = nameArr[0];
  userBody.last_name = nameArr[1];
  delete userBody.name;
  try {
    console.log(userBody);
    const user = await User.createUser(userBody);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Wrong with the database" });
  }
};
