const express = require("express");

const {
  checkBodyAndHashPass,
  addUser,
  checkSignInBody,
  checkIfUserExistsByEmail,
  signIn,
  getToken,
  checkEditBody,
  updateUser,
  deleteUser,
  getAllUsers
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", checkBodyAndHashPass, addUser);
router.post("/signin", checkSignInBody, checkIfUserExistsByEmail, signIn);
router
  .route("/user")
  .put(
    getToken,
    checkEditBody,
    updateUser
  )
  .delete(getToken, deleteUser);

//// ONLY FOR DEV
if(process.env.NODE_ENV === "development"){
  router.route("/users").get(getAllUsers);
}

module.exports = router;
