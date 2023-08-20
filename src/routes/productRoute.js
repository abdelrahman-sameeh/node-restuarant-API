const express = require("express");
const {
  createProduct,
  uploadSingleImage,
  getListOfProducts,
  deleteOneProduct,
  getOneProduct,
  updateOneProduct,
} = require("../services/productService");
const AuthService = require("../services/authService");
const {
  createProductValidator,
  updateProductValidator,
} = require("../validator/productValidator");
const router = express.Router();

router
  .route("/products")
  .post(
    AuthService.protect,
    AuthService.allowTo("admin"),
    uploadSingleImage("image"),
    createProductValidator,
    createProduct
  )
  .get(getListOfProducts);

router
  .route("/products/:id")
  .get(getOneProduct)
  .delete(AuthService.protect, AuthService.allowTo("admin"), deleteOneProduct)
  .put(
    AuthService.protect,
    AuthService.allowTo("admin"),
    uploadSingleImage("image"),
    updateProductValidator,
    updateOneProduct
  );

module.exports = router;
