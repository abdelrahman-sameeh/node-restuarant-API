const express = require('express');
const router = express.Router()
const AuthService = require('../services/authService');
const { createCashOrder, getAllOrders, getSpecificOrder, getLoggedUserOrders, deleteOrder } = require('../services/orderService');
const { createOrderValidator } = require('../validator/orderValidator');


router.route('/order')
   .get(
      // AuthService.protect,
      // AuthService.allowTo('admin'),
      getAllOrders
   )




router.route('/order/:id')
   .get(
      AuthService.protect,
      AuthService.allowTo('admin', 'user'),
      getSpecificOrder
   )
   .delete(
      AuthService.protect,
      AuthService.allowTo('admin', 'user'),
      deleteOrder
   )



router.post(
   '/createCashOrder',
   AuthService.protect,
   AuthService.allowTo('user'),
   createOrderValidator,
   createCashOrder
)

router.get(
   '/userOrders',
   AuthService.protect,
   AuthService.allowTo('user'),
   getLoggedUserOrders
)

module.exports = router