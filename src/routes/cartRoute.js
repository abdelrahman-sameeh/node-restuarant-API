const express = require('express');
const AuthService = require('../services/AuthService');
const { addProductToCart, getLoggedUserCart, deleteProductFromCartItems, getAllCarts } = require('../services/cartService');
const { addProductToCartValidator } = require('../validator/cartValidator');

const router = express.Router();

router.route('/cart')
   .post(
      AuthService.protect,
      AuthService.allowTo('user'),
      addProductToCartValidator,
      addProductToCart
   )
   .get(
      AuthService.protect,
      AuthService.allowTo('user'),
      getLoggedUserCart
   )
   .delete(
      AuthService.protect,
      AuthService.allowTo('user'),
      deleteProductFromCartItems
   )

router.get(
   '/allCarts',
   AuthService.protect,
   AuthService.allowTo('admin'),
   getAllCarts
)


module.exports = router;