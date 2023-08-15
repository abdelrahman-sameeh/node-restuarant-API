const express = require('express');
const { addProductToFavorite, deleteProductFromFavorite, getLoggedUser } = require('../services/userService');
const AuthService = require('../services/AuthService');
const { addProductToFavoriteValidator, removeProductFromFavoriteValidator } = require('../validator/userValidator');

const router = express.Router();


router.get(
   '/user',
   AuthService.protect,
   getLoggedUser
)

router.put(
   '/addProductToFavorite/:id',
   AuthService.protect,
   AuthService.allowTo('user'),
   addProductToFavoriteValidator,
   addProductToFavorite
)


router.delete(
   '/deleteProductFromFavorite/:id',
   AuthService.protect,
   AuthService.allowTo('user'),
   removeProductFromFavoriteValidator,
   deleteProductFromFavorite
)




module.exports = router;