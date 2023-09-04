const expressAsyncHandler = require("express-async-handler");
const Delivery = require("../model/deliveryModel");
const User = require("../model/userModel");
const ApiError = require("../utils/ApiError");
const Order = require("../model/orderModel");
const crypto = require("crypto");
const handleFactory = require("./handleFactory");

// @desc    add order to user delivery
// @route   POST  /api/v1/delivery
// @access  protect (admin)
exports.addOrderToDelivery = expressAsyncHandler(async (req, res, next) => {
  // 1- validation
  if (!req.body.user) {
    return next(new ApiError("user delivery id is required"));
  }
  if (!req.body.order) {
    return next(new ApiError("order id is required"));
  }

  // 2- get delivery user and order to check if these exist or not
  const user = await User.findById(req.body.user);

  if (!user) {
    return next(new ApiError("No user match this id"));
  }

  const order = await Order.findById(req.body.order);
  if (!order) {
    return next(new ApiError("No order match this id"));
  }

  // 3- set delivery user in order
  order.delivery = req.body.user;
  await order.save();

  // 4- delete order from all deliveries
  await Delivery.deleteMany({ order: req.body.order });

  // 5- add order to delivery user
  let response;
  if (user.role === "delivery") {
    response = await Delivery.create(req.body);
  }
  // 6- return response
  res.status(200).json(response);
});

// @desc    Change order delivery status
// @route   POST  /api/v1/scanQRcodeOrder/:id
// @access  protect (admin)
exports.scanQRcodeOrder = async (req, res, next) => {
  // 1- get SSH from body and check if user has role delivery or not
  const SSH = crypto.createHash("sha512").update(req.body.SSH).digest("binary");
  const user = await User.findOne({ SSH });


  if (!user) {
    return next(new ApiError("SSH is incorrect", 400));
  }

  if (user.role !== "delivery") {
    return next(new ApiError("the role of this user not delivery", 400));
  }
  const orderId = req.params.id;

  
  // 2- check if this order for this delivery or not ---> if (true) update order status
  const order = await Delivery.findOne({ order: orderId, user: user._id });
  
  console.log(orderId);
  console.log(user);

  if (!order) {
    return next(new ApiError("This delivery have no access for this user "));
  }

  const response = await Order.findOneAndUpdate(
    { _id: orderId },
    {
      isDelivered: true,
      deliveredAt: Date.now(),
      isPaid: true,
      paidAt: Date.now(),
    }
  );

  if (!response) {
    return next(
      new ApiError("something went wrong during change delivery status", 400)
    );
  }

  res.status(200).json({
    msg: "Order status changed successfully",
  });
};

// @desc    add filter on handleFactory to get list of orders
exports.deliveryGetOrdersFilter = (req, res, next) => {
  req.body.filter = {
    user: req.user._id,
  };
  next();
};

// @desc    get orders that delivery must delivered
// @route   GET  /api/v1/delivery/getDeliveryOrders
// @access  protect (delivery)
exports.getDeliveryOrders = handleFactory.getListOfItems(Delivery, "delivery");

// @desc   filter to get all user deliveries
exports.getUserDeliveriesFilter = (req, res, next) => {
  req.body.filter = {
    role: "delivery",
  };
  next();
};

// @desc    get all user deliveries
// @route   GET  /api/v1/delivery/getAllUserDeliveries
// @access  protect (admin)
exports.getAllUserDeliveries = handleFactory.getListOfItems(User, "user");
