const express = require("express");
const router = express.Router();
const AuthService = require("../services/authService");
const {
  addOrderToDelivery,
  scanQRcodeOrder,
  getDeliveryOrders,
  getUserDeliveriesFilter,
  deliveryGetOrdersFilter,
  getAllUserDeliveries,
} = require("../services/deliveryService");

router.get(
  "/getDeliveryOrders",
  AuthService.protect,
  AuthService.allowTo("delivery"),
  deliveryGetOrdersFilter,
  getDeliveryOrders
);
router.get(
  "/getAllUserDeliveries",
  AuthService.protect,
  AuthService.allowTo("admin"),
  getUserDeliveriesFilter,
  getAllUserDeliveries
);

router.post(
  "/addOrderToDelivery",
  AuthService.protect,
  AuthService.allowTo("admin"),
  addOrderToDelivery
);

router.post("/scanQRcodeOrder/:id", scanQRcodeOrder);

module.exports = router;
