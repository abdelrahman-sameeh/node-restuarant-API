const expressAsyncHandler = require("express-async-handler");
const Delivery = require("../model/deliveryModel");
const User = require("../model/userModel");
const ApiError = require("../utils/ApiError");
const qrcode = require("qrcode");
const Order = require("../model/orderModel");

// @desc    add order to user delivery
// @route   POST  /api/v1/delivery
// @access  protect (admin)
exports.addOrderToDelivery = expressAsyncHandler(async (req, res, next) => {
  // 1- get delivery user
  const user = await User.findById(req.body.user);

  // 2- check if delivery have same order
  const order = await Delivery.findOne({ order: req.body.order });
  if (order) {
    return next(new ApiError("order in delivery status already", 400));
  }

  // 3- add order to delivery user
  let response;
  if (user.role === "delivery") {
    response = await Delivery.create(req.body);
  }
  res.status(200).json(response);
});


// @desc    Change order delivery status
// @route   GET  /api/v1/delivery
// @access  protect (admin)
exports.changeOrderDeliveryStatus = async (req, res, next) => {
  const orderId = req.params.id;
  const response = await Order.findByIdAndUpdate(orderId, {
    isDelivered: true,
    deliveredAt: Date.now(),
    isPaid: true,
    paidAt: Date.now(),
  });

  if (!response) {
    return next(
      new ApiError("something went wrong during change delivery status", 400)
    );
  }

  res.status(200).json({
    msg: "Order status changed successfully",
  });
};
