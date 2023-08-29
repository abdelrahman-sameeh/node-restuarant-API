const express = require("express");
const {
  createMeal,
  uploadSingleImage,
  getListOfMeals,
  deleteOneMeal,
  getOneMeal,
  updateOneMeal,
} = require("../services/mealService");
const AuthService = require("../services/authService");
const {
  createMealValidator,
  updateMealValidator,
  checkMealIDValidator,
} = require("../validator/mealValidator");
const { setImageInBody } = require("../services/handleFactory");
const router = express.Router();

router
  .route("/meals")
  .post(
    AuthService.protect,
    AuthService.allowTo("admin"),
    uploadSingleImage("image", "meals"),
    setImageInBody,
    createMealValidator,
    createMeal
  )
  .get(getListOfMeals);

router
  .route("/meals/:id")
  .get(checkMealIDValidator, getOneMeal)
  .delete(
    AuthService.protect,
    AuthService.allowTo("admin"),
    checkMealIDValidator,
    deleteOneMeal
  )
  .put(
    AuthService.protect,
    AuthService.allowTo("admin"),
    uploadSingleImage("image", "meals"),
    setImageInBody,
    checkMealIDValidator,
    updateMealValidator,
    updateOneMeal
  );

module.exports = router;
