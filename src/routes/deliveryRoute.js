const express = require("express");
const router = express.Router();
const AuthService = require("../services/authService");
const {
  addOrderToDelivery,
  scanQRcodeOrder,
} = require("../services/deliveryService");

router.post(
  "/addOrderToDelivery",
  AuthService.protect,
  AuthService.allowTo("admin"),
  addOrderToDelivery
);

router.post("/scanQRcodeOrder/:id", scanQRcodeOrder);

module.exports = router;
