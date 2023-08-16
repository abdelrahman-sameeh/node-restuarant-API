const { check } = require("express-validator");
const Product = require("../model/productModel");
const { validationResultMiddleware } = require("../middleware/validationResultMiddleware");

exports.addProductToCartValidator = [
   check('id')
      .notEmpty().withMessage('Product ID is required')
      .isMongoId().withMessage('Product ID is not valid')
      .custom(async (value, { req }) => {
         // size
         const product = await Product.findById(value);
         req.product = product;


         if (!product) {
            throw 'no product match this id'
         }
         if (product.size.length > 0) {
            if (!req.body.size) {
               throw 'size is required'
            }
            if (!product.size.includes(req.body.size)) {
               throw `size must be on of these sizes (${product.size.join(', ')})`
            }
         }
         return true;
      }),
   validationResultMiddleware
]