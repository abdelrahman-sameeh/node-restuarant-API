const { check } = require("express-validator");
const {
  validationResultMiddleware,
} = require("../middleware/validationResultMiddleware");
const Product = require("../model/mealModel");
const User = require("../model/userModel");

exports.addProductToFavoriteValidator = [
  check("id")
    .isMongoId()
    .withMessage("this id is not valid")
    .custom(async (id) => {
      // check if product is already existing
      const product = await Product.findById(id);
      if (!product) {
        throw "no product match this id";
      }
      return true;
    }),
  validationResultMiddleware,
];

exports.removeProductFromFavoriteValidator = [
  check("id")
    .isMongoId()
    .withMessage("this id is not valid")
    .custom(async (id) => {
      // check if product is already existing
      const product = await Product.findById(id);
      if (!product) {
        throw "no product match this id";
      }
      return true;
    })
    .custom(async (value, { req }) => {
      // check if favorite contains this product
      const user = await User.findById(req.user._id);
      if (!user.favorites.includes(value)) {
        throw "you don't have this product in your favorites";
      }
      return true;
    }),
  validationResultMiddleware,
];

exports.createUserValidator = [
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw "This email already used";
      }
      return true;
    }),
  check("name")
    .notEmpty()
    .withMessage("User name is required ")
    .isLength({ min: 2 })
    .withMessage("Name must be greater than 1"),
  check("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4 })
    .withMessage("Password must be greater than 4"),
  check("role")
    .notEmpty()
    .withMessage("User role is required")
    .custom(async (value, { req }) => {
      if (value === "delivery" && !req.body.SSH) {
        throw "SSH is required";
      }
      return true;
    }),
  check("SSH")
    .optional()
    .isLength({ min: 4 })
    .withMessage("SSH must be greater than 4"),
  validationResultMiddleware,
];

exports.checkUserIDValidator = [
  check("id")
    .notEmpty()
    .withMessage("user id is required")
    .isMongoId()
    .withMessage("Enter a valid ID :|")
    .custom(async (value) => {
      const user = await User.findById(value);
      if (!user) {
        throw `No user match this ID => ${value}`;
      }
      return true;
    }),
  validationResultMiddleware,
];
