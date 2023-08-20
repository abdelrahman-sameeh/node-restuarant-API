const express = require("express");
const AuthService = require("../services/authService");
const {
  getListOfCoupons,
  createCoupon,
  getOneCoupon,
  deleteOneCoupon,
  updateOneCoupon,
} = require("../services/couponService");
const {
  createCouponValidator,
  updateCouponValidator,
} = require("../validator/couponValidator");
const router = express.Router();


router
  .route("/coupon")
  .post(
    AuthService.protect,
    AuthService.allowTo("admin"),
    createCouponValidator,
    createCoupon
  )
  .get(AuthService.protect, AuthService.allowTo("admin"), getListOfCoupons);

router
  .route("/coupon/:id")
  .get(AuthService.protect, AuthService.allowTo("admin"), getOneCoupon)
  .delete(AuthService.protect, AuthService.allowTo("admin"), deleteOneCoupon)
  .put(
    AuthService.protect,
    AuthService.allowTo("admin"),
    updateCouponValidator,
    updateOneCoupon
  );

module.exports = router;
