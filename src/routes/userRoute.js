const express = require("express");
const {
  addProductToFavorite,
  deleteProductFromFavorite,
  getLoggedUser,
  createUser,
  hashingPassOrSSH,
  getListOfUsers,
  getOneUser,
  deleteUser,
  updateUserInfo,
} = require("../services/userService");
const AuthService = require("../services/authService");
const {
  addProductToFavoriteValidator,
  removeProductFromFavoriteValidator,
  createUserValidator,
  checkUserIDValidator,
} = require("../validator/userValidator");

const router = express.Router();

// admin CRUD
router.post(
  "/createUser",
  AuthService.protect,
  AuthService.allowTo("admin"),
  createUserValidator,
  hashingPassOrSSH,
  createUser
);

router.get(
  "/users",
  AuthService.protect,
  AuthService.allowTo("admin"),
  getListOfUsers
);

router
  .route("/user/:id")
  .get(
    AuthService.protect,
    AuthService.allowTo("admin"),
    checkUserIDValidator,
    getOneUser
  )
  .delete(
    AuthService.protect,
    AuthService.allowTo("admin"),
    checkUserIDValidator,
    deleteUser
  );

// for user
router.get("/user", AuthService.protect, getLoggedUser);

router.put(
  "/addProductToFavorite/:id",
  AuthService.protect,
  AuthService.allowTo("user"),
  addProductToFavoriteValidator,
  addProductToFavorite
);

router.delete(
  "/deleteProductFromFavorite/:id",
  AuthService.protect,
  AuthService.allowTo("user"),
  removeProductFromFavoriteValidator,
  deleteProductFromFavorite
);

router.post("/updateUserInfo", AuthService.protect, updateUserInfo);

module.exports = router;
