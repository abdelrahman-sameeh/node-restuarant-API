const express = require("express");
const {
  register,
  login,
  changePassword,
  forgetPassword,
  verifyPasswordResetCode,
  changePasswordAfterReset,
  protect,
  allowTo,
} = require("../services/authService");
const router = express.Router();
const {
  registerValidator,
  loginValidator,
} = require("../validator/authValidator");

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/changePassword", protect, changePassword);

router.post("/forgetPassword", forgetPassword);
router.post("/verifyPassword", verifyPasswordResetCode);
router.post("/changePasswordAfterReset", changePasswordAfterReset);

module.exports = router;
