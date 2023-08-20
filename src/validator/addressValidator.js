const { check } = require("express-validator");
const User = require("../model/userModel");
const {
  validationResultMiddleware,
} = require("../middleware/validationResultMiddleware");

exports.createAddressValidator = [
  // user => userId
  check("user")
    .notEmpty()
    .withMessage("Address must be belong to a user")
    .isMongoId()
    .withMessage("user id is invalid")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw "User not found";
      }
      return true;
    }),
  check("alias")
    .notEmpty()
    .withMessage("alias is required")
    .isLength({ min: 2 })
    .withMessage("alias length must be more than 2 characters"),
  check("details").notEmpty().withMessage("alias is required"),
  check("phone")
    .notEmpty()
    .withMessage("phone is required")
    .isMobilePhone(["ar-EG"])
    .withMessage("accept only EGY phone number"),
  check("city").notEmpty().withMessage("city is required"),
  check("postalCode").notEmpty().withMessage("postalCode is required"),
  validationResultMiddleware,
];

exports.updateAddressValidator = [
  // user => userId
  check("user")
    .optional()
    .notEmpty()
    .withMessage("Address must be belong to a user")
    .isMongoId()
    .withMessage("user id is invalid")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw "User not found";
      }
      return true;
    }),
  check("alias")
    .optional()
    .notEmpty()
    .withMessage("alias is required")
    .isLength({ min: 2 })
    .withMessage("alias length must be more than 2 characters"),
  check("details").optional().notEmpty().withMessage("alias is required"),
  check("phone")
    .optional()
    .notEmpty()
    .withMessage("phone is required")
    .isMobilePhone(["ar-EG"])
    .withMessage("accept only EGY phone number"),
  check("city").optional().notEmpty().withMessage("city is required"),
  check("postalCode")
    .optional()
    .notEmpty()
    .withMessage("postalCode is required"),
  validationResultMiddleware,
];
