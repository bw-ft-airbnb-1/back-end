const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateAToken = userData => {
  const privateKey = process.env.TOKEN_SECRET;
  const jwtConfig = {
    expiresIn: 1000 * 60 * 60 * 24 * 7
  };
  const token = jwt.sign({ data: userData }, privateKey, jwtConfig);
  return token;
};

exports.getToken = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: "Please provide a token" });
    }
    const decoded = jwt.verify(authorization, process.env.TOKEN_SECRET);
    console.log(decoded);
    if (!decoded) {
      return res.status(403).json({ error: "You shall not pass" });
    }
    req.userID = decoded.data.id;
    next();
  } catch (error) {
    console.log(error);
  }
};

exports.addUser = async (req, res) => {
  let { name, password, email } = req.body;
  if (!name || !email || !password) {
    return res
      .status(401)
      .json({ error: "Missing name, email or password field" });
  }
  const nameArr = name.split(" ");
  name = nameArr[0];
  const hash = bcrypt.hashSync(password, 8);
  const avatar =
    "https://res.cloudinary.com/dbcax4vbb/image/upload/v1578342211/computer-icons-user-profile-avatar-profile_saieve.jpg";
  password = hash;
  try {
    let user = await User.createUser({ name, email, password, avatar });
    console.log(user);
    user = await User.getUserById(user[0].id);
    console.log(user);
    delete user.password;
    console.log(user.id);
    const token = generateAToken({ id: user.id });
    console.log(token);
    return res.status(200).json({ user: user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Wrong with the database" });
  }
};

exports.signIn = async (req, res) => {
  let { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({ error: "Missing email or password field" });
  }
  try {
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Did not find user with that email" });
    }
    const checkPass = bcrypt.compareSync(password, user.password);
    if (!checkPass) {
      return res.status(401).json({ error: "Wrong email or password" });
    }
    delete user.password;
    const token = generateAToken({ id: user.id });
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Wrong with the database" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let { name, email } = req.body;
    const id = req.userID;
    if (!name || !email) {
      return res
        .status(401)
        .json({ error: "Missing name, email or password field" });
    }
    const nameArr = name.split(" ");
    name = nameArr[0];
    const user = await User.update(id, { name, email });
    console.log(user);
    res.status(200).json(user[0]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something wrong with the server" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.userID;
    await User.delete(id);
    res.status(200).json({
      message: "User Deleted, Please Remove Token and redirect to homepage"
    });
  } catch (error) {
    res.status(500).json({ error: "Server malfunctioning" });
  }
};

exports.getAllUsers = async (req, res) => {
  const { role } = req.body;
  if (!role) {
    return res.status(403).json({ error: "You shall not pass" });
  }
  try {
    const users = await User.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Server malfunctioning" });
  }
};