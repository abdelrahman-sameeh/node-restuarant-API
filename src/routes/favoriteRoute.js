const express = require("express");
const {
  addOneMealToFavorite,
  deleteOneMealFromValidator,
  getFavoriteForLoggedUser,
} = require("../services/favoriteService");


const {
  addOneToFavValidator,
  deleteOneFromFavValidator,
} = require("../validator/favoriteValidator");
const router = express.Router();
const AuthService = require("../services/authService");

router.get(
  "/favorite",
  AuthService.protect,
  AuthService.allowTo("user"),
  getFavoriteForLoggedUser
);

router
  .route("/favorite/:meal")
  .post(
    AuthService.protect,
    AuthService.allowTo("user"),
    addOneToFavValidator,
    addOneMealToFavorite
  )
  .delete(
    AuthService.protect,
    AuthService.allowTo("user"),
    deleteOneFromFavValidator,
    deleteOneMealFromValidator
  );

module.exports = router;
