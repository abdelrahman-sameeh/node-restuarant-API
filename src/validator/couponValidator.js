const { check } = require("express-validator");
const { validationResultMiddleware } = require("../middleware/validationResultMiddleware");
const Coupon = require("../model/couponModel");

exports.createCouponValidator = [
   check('name')
      .notEmpty().withMessage('coupon name is required')
      .custom(async (value) => {
         // check if name already exists
         const coupon = await Coupon.findOne({ name: value });
         if (coupon) {
            throw 'Coupon name must be unique'
         }
         return true
      })
   ,
   check('expire')
      .notEmpty().withMessage('coupon expiration is required')
      .custom((value) => {
         // check if time greater than date.now()
         if (new Date(value).getTime() < Date.now()) {
            throw 'Enter a time greater than now'
         }
         return true
      }),
   check('discount')
      .notEmpty().withMessage('discount is required')
      .custom((value) => {
         if (value > 100 || value < 0) {
            throw 'Discount must be between 0 and 100'
         }
         return true
      }),
   validationResultMiddleware
]


exports.updateCouponValidator = [
   check('name')
      .optional()
      .notEmpty().withMessage('coupon name is required')
      .custom(async (value) => {
         // check if name already exists
         const coupon = await Coupon.findOne({ name: value });
         if (coupon) {
            throw 'Coupon name must be unique'
         }
         return true
      }),
   check('expire')
      .optional()
      .notEmpty().withMessage('coupon expiration is required')
      .custom((value) => {
         // check if time greater than date.now()
         if (new Date(value).getTime() < Date.now()) {
            throw 'Enter a time greater than now'
         }
         return true
      }),
   check('discount')
      .optional()
      .notEmpty().withMessage('discount is required')
      .custom((value) => {
         if (value > 100 || value < 0) {
            throw 'Discount must be between 0 and 100'
         }
         return true
      }),
   validationResultMiddleware
]