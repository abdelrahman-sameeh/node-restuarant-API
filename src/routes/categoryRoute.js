const express = require("express");
const AuthService = require("../services/authService");
const {
  deleteOneCategory,
  getListOfCategories,
  createCategory,
  updateOneCategory,
  getOneCategory,
} = require("../services/categoryService");
const { uploadSingleImage } = require("../services/mealService");
const {
  createCategoryValidator,
  updateCategoryValidator,
  getOneCategoryValidator,
  deleteCategoryValidator,
} = require("../validator/categoryValidator");
const { setImageInBody } = require("../services/handleFactory");
const router = express.Router();

router
  .route("/category")
  .post(
    AuthService.protect,
    AuthService.allowTo("admin"),
    uploadSingleImage("image", "Category"),
    setImageInBody,
    createCategoryValidator,
    createCategory
  )
  .get(getListOfCategories);

router
  .route("/category/:id")
  .get(getOneCategoryValidator, getOneCategory)
  .delete(
    AuthService.protect,
    AuthService.allowTo("admin"),
    deleteCategoryValidator,
    deleteOneCategory
  )
  .put(
    AuthService.protect,
    AuthService.allowTo("admin"),
    uploadSingleImage("image", "Category"),
    setImageInBody,
    updateCategoryValidator,
    updateOneCategory
  );

module.exports = router;
