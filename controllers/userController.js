const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");


//// ADDS NEW USER - RETURNS USER AND TOKEN
exports.addUser = catchAsync(async (req, res, next) => {
  let user = await User.createUser(req.userBody);
  user = user[0];
  const token = generateAToken(user);
  return res.status(200).json({ user, token });
});

//// SIGN IN - RETURNS USER AND TOKEN
exports.signIn = catchAsync(async (req, res, next) => {
  let { password } = req.body;
  const user = req.user;
  const checkPass = bcrypt.compareSync(password, user.password);
  if (!checkPass) {
    return next(new AppError("Wrong email or password", 401));
  }
  delete user.password;
  const token = generateAToken(user);
  return res.status(200).json({ user, token });
});

//// UPDATE USER - RETURN EDITED USER
exports.updateUser = catchAsync(async (req, res) => {
  const user = await User.update(req.userID, req.user);
  res.status(200).json(user[0]);
});

//// DELETE A USER - RETURNS MSG
exports.deleteUser = catchAsync(async (req, res) => {
  await User.delete(req.userID);
  res.status(200).json({
    message: "User Deleted, Please Remove Token and redirect to homepage"
  });
});

//// GET ONE USER USING TOKEN
exports.getOneUser = (req, res) => {
  res.status(200).json(req.user);
};

/// ONLY FOR DEV
exports.getAllUsers = catchAsync(async (req, res) => {
  const { role } = req.body;
  if (!role) {
    return next(new AppError("Not Allowed"))
  }
  const users = await User.getAllUsers();
  return res.status(200).json(users);
});

exports.getAllUserProperties = catchAsync(async (req, res) => {
  const properties = await User.getProperties(req.userID);
  res.status(200).json(properties);
});



//// MIDDLEWARE
exports.checkBodyAndHashPass = catchAsync(async (req, res, next) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError("Enter name, email and password", 401));
  }
  if (name.includes(" ")) {
    name = name.split(" ")[0];
  }
  const user = await User.getUserByEmail(email);
  if (user) {
    return next(new AppError("User with that email already exists", 401));
  }
  const hash = bcrypt.hashSync(password, 8);
  password = hash;
  const avatar =
    "https://res.cloudinary.com/dbcax4vbb/image/upload/v1578342211/computer-icons-user-profile-avatar-profile_saieve.jpg";
  req.userBody = { name, email, password, avatar };
  next();
});

exports.checkIfUserExistsByEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.getUserByEmail(email);
  if (!user) {
    return next(new AppError("Could not find a user with that email", 401));
  }
  req.user = user;
  next();
});

exports.checkSignInBody = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 401));
  }
  next();
};

exports.checkEditBody = (req, res, next) => {
  let { email, name } = req.body;
  if (!email || !name) {
    return next(new AppError("Please provide email and name ", 401));
  }
  if (name.includes(" ")) {
    name = name.split(" ")[0];
  }
  req.user = { email, name };
  next();
};

const generateAToken = userData => {
  const privateKey = process.env.TOKEN_SECRET;
  const jwtConfig = {
    expiresIn: 1000 * 60 * 60 * 24 * 7
  };
  const token = jwt.sign({ data: userData }, privateKey, jwtConfig);
  return token;
};

exports.getToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(new AppError("Please provide a token", 401));
  }
  jwt.verify(authorization, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError("Invalid Token", 403));
    }
    req.userID = decoded.data.id;
    req.user = decoded.data;
    next();
  });
};
