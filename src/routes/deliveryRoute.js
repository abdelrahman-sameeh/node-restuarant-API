const express = require('express')
const router = express.Router()
const AuthService = require('../services/authService')
const { addOrderToDelivery, changeOrderDeliveryStatus } = require('../services/deliveryService')

router.post(
  '/addOrderToDelivery',
  AuthService.protect,
  AuthService.allowTo('admin'),
  addOrderToDelivery
)


router.get(
  '/orderIsDelivered/:id',
  // AuthService.protect,
  // AuthService.allowTo('admin', 'delivery'),
  changeOrderDeliveryStatus
)



module.exports = router