const { check } = require("express-validator");
const User = require("../model/userModel");
const Meal = require("../model/mealModel");
const {
  validationResultMiddleware,
} = require("../middleware/validationResultMiddleware");

exports.addOneToFavValidator = [
  check("meal")
    .isMongoId()
    .withMessage("Enter a valid meal id")
    // check if this meal in already exist
    .custom(async (value) => {
      const meal = await Meal.findById(value);
      if (!meal) {
        throw "No meal match this id";
      }
      return true;
    })
    // check if user have this meal
    .custom(async (value, { req }) => {
      const user = await User.findById(req.user._id);
      const check = user.favorites.some(meal=> meal._id.toString() === value)
      if (check)
        throw "Meal already exist in your favorites";
      return true;
    }),
  validationResultMiddleware,
];

exports.deleteOneFromFavValidator = [
  check("meal")
    .isMongoId()
    .withMessage("Enter a valid meal id")
    // check if user have meal in favorite
    .custom(async (value, { req }) => {
      const user = await User.findById(req.user._id);
      const check = user.favorites.some(meal => meal._id.toString() === value)
      if (!check) {
        throw "This meal don't exist from user favorites";
      }
      return true;
    }),
    validationResultMiddleware
];
