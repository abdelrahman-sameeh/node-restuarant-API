const { check } = require("express-validator");
const { validationResultMiddleware } = require("../middleware/validationResultMiddleware");
const Product = require("../model/productModel");
const User = require("../model/userModel");


exports.addProductToFavoriteValidator = [
   check('id')
      .isMongoId().withMessage('this id is not valid')
      .custom(async (id) => {
         // check if product is already existing
         const product = await Product.findById(id);
         if (!product) {
            throw 'no product match this id'
         }
         return true
      }),
   validationResultMiddleware
]

exports.removeProductFromFavoriteValidator = [
   check('id')
      .isMongoId().withMessage('this id is not valid')
      .custom(async (id) => {
         // check if product is already existing
         const product = await Product.findById(id);
         if (!product) {
            throw 'no product match this id'
         }
         return true
      })
      .custom(async(value, {req})=>{
         // check if favorite contains this product
         const user = await User.findById(req.user._id);
         if(!user.favorites.includes(value)){
            throw 'you don\'t have this product in your favorites'
         }
         return true
      }),
   validationResultMiddleware
]