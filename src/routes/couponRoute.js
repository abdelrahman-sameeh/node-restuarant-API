const express = require('express')
const AuthService = require('../services/AuthService')
const { getListOfCoupons, createCoupon, getOneCoupon, deleteOneCoupon, updateOneCoupon } = require('../services/couponService')
const { createCouponValidator, updateCouponValidator } = require('../validator/couponValidator')
const router = express.Router()


router.use(
   AuthService.protect,
   AuthService.allowTo('admin')
)


router.route('/coupon')
   .post(
      createCouponValidator,
      createCoupon
   )
   .get(getListOfCoupons)



router.route('/coupon/:id')
   .get(getOneCoupon)
   .delete(deleteOneCoupon)
   .put(
      updateCouponValidator,
      updateOneCoupon
   )


module.exports = router