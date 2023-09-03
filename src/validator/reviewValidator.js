const { check } = require("express-validator");
const Review = require("../model/reviewModel");
const User = require("../model/userModel");
const {
  validationResultMiddleware,
} = require("../middleware/validationResultMiddleware");
const Meal = require("../model/mealModel");

exports.addReviewValidator = [
  check("user")
    .notEmpty()
    .withMessage("User is required")
    .isMongoId()
    .withMessage("Enter a valid user id ")
    .custom(async (value) => {
      // check if user exist
      const user = await User.findById(value);
      if (!user) {
        throw "User is not exist";
      }
      // check if user have more than one review
      const review = await Review.findOne({ user: value });
      if (review) {
        throw "User mustn't have more than one review";
      }
      return true;
    }),
  check("rating")
    .notEmpty()
    .custom((v) => {
      if (+v < 1) throw "minimum length must be 1";
      if (+v > 5) throw "maximum length must be 5";
      return true;
    }),
  check("title")
    .notEmpty()
    .withMessage("Review title is required")
    .isLength({ min: 3 })
    .withMessage("Too short review title"),
  check("meal").custom(async (value) => {
    const meal = await Meal.findById(value);
    if (!meal) {
      throw "No meal match this ID";
    }
    return true;
  }),
  validationResultMiddleware,
];

exports.updateReviewValidator = [
  check("user")
    .notEmpty()
    .withMessage("User is required")
    .isMongoId()
    .withMessage("Enter a valid user id ")
    .custom(async (value, { req }) => {
      const user = await User.findById(value);
      if (!user) {
        throw "No user match this id";
      }
      return true;
    }),
  check("rating")
    .optional()
    .custom((v) => {
      if (+v < 1) throw "minimum length must be 1";
      if (+v > 5) throw "maximum length must be 5";
      return true;
    }),
  check("title")
    .optional()
    .isLength({ min: 4 })
    .withMessage("Too short review title"),

  validationResultMiddleware,
];

exports.checkId = [
  check("id")
    .isMongoId()
    .withMessage("Enter a valid id")
    .custom(async (value) => {
      const review = await Review.findById(value);
      if (!review) {
        throw "No review match this ID";
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const review = await Review.findOne({ user: req.user._id, _id: value });
      if (
        !review &&
        (req.user.role === "user" || req.user.role === "delivery")
      ) {
        throw "This review not belong to this user";
      }
      return true;
    }),

  validationResultMiddleware,
];
