const express = require("express");
const AuthService = require("../services/authService");
const {
  addProductToCart,
  getLoggedUserCart,
  deleteProductFromCartItems,
  getAllCarts,
  applyCoupon,
  updateCart,
} = require("../services/cartService");
const { addProductToCartValidator } = require("../validator/cartValidator");

const router = express.Router();

router
  .route("/cart")
  .post(
    AuthService.protect,
    AuthService.allowTo("user"),
    addProductToCartValidator,
    addProductToCart
  )
  .get(AuthService.protect, AuthService.allowTo("user"), getLoggedUserCart)
  .put(AuthService.protect, AuthService.allowTo("user"), updateCart);


router.delete(
  "/cart/:id",
  AuthService.protect,
  AuthService.allowTo("user"),
  deleteProductFromCartItems
);

router.get(
  "/allCarts",
  AuthService.protect,
  AuthService.allowTo("admin"),
  getAllCarts
);

router.put(
  "/applyCoupon/:name",
  AuthService.protect,
  AuthService.allowTo("user"),
  applyCoupon
);

module.exports = router;
