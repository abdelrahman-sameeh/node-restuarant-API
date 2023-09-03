const express = require("express");
const router = express.Router();
const AuthService = require("../services/authService");
const {
  getAllAddresses,
  addNewAddress,
  deleteAddress,
  updateAddress,
  getAddress,
  getLoggedUserAddresses,
} = require("../services/addressService");
const {
  updateAddressValidator,
  createAddressValidator,
} = require("../validator/addressValidator");
const {setUserIdInBody} = require('../services/utility')


router
  .route("/address")
  .get(AuthService.protect, AuthService.allowTo("admin"), getAllAddresses)
  .post(
    AuthService.protect,
    AuthService.allowTo("user"),
    setUserIdInBody,
    createAddressValidator,
    addNewAddress
  );


router.get(
  "/userAddresses",
  AuthService.protect,
  AuthService.allowTo("user", "admin"),
  getLoggedUserAddresses
);

router
  .route("/address/:id")
  .get(AuthService.protect, AuthService.allowTo("user", "admin"), getAddress)
  .put(
    AuthService.protect,
    AuthService.allowTo("user", "admin"),
    updateAddressValidator,
    updateAddress
  )
  .delete(
    AuthService.protect,
    AuthService.allowTo("user", "admin"),
    deleteAddress
  );

module.exports = router;
