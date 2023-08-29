const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/ApiError");
const User = require("../model/userModel");
const Meal = require("../model/mealModel");

exports.addOneMealToFavorite = expressAsyncHandler(async (req, res, next) => {
  // add to user favorite
  const user = await User.findByIdAndUpdate(req.user._id, {
    $addToSet: { favorites: req.params.meal },
  });

  // add to meal favorite
  const meal = await Meal.findByIdAndUpdate(req.params.meal, {
    $addToSet: { favorites: req.user._id },
  });

  if (!user) {
    return next(new ApiError("Something went wrong when add meal", 400));
  }

  res.status(200).json({
    message: "Meal added to favorite successfully",
  });
});

exports.deleteOneMealFromValidator = expressAsyncHandler(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
      $pull: { favorites: req.params.meal },
    });

    // add to meal favorite
    const meal = await Meal.findByIdAndUpdate(req.params.meal, {
      $pull: { favorites: req.user._id },
    });

    res.status(200).json({
      message: "Meal deleted from favorite successfully",
    });
  }
);

exports.getFavoriteForLoggedUser = expressAsyncHandler(
  async (req, res, next) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      favorites: user.favorites,
    });
  }
);
