const express = require("express");

const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", userController.addUser);
router.post("/signin", userController.signIn);
router
  .route("/user")
  .put(userController.getToken, userController.updateUser)
  .delete(userController.getToken, userController.deleteUser);

module.exports = router;
