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

exports.addUser = async (req, res) => {
  let { name, password, email } = req.body;
  if (!name || !email || !password) {
    return res
      .status(401)
      .json({ error: "Missing name, email or password field" });
  }
  const nameArr = name.split(" ");
  name = nameArr[0];
  const token = generateAToken({ name, email });
  const hash = bcrypt.hashSync(password, 8);
  const avatar =
    "https://res.cloudinary.com/dbcax4vbb/image/upload/v1578342211/computer-icons-user-profile-avatar-profile_saieve.jpg";
  password = hash;
  try {
    const user = await User.createUser({ name, email, password, avatar })[0];
    return res.status(200).json({ user, token });
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
    const token = generateAToken({ name: user.name, email });
    return res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Wrong with the database" });
  }
};
