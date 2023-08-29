const handleFactory = require("./handleFactory");
const Order = require("../model/orderModel");
const expressAsyncHandler = require("express-async-handler");
const Cart = require("../model/cartModel");
const ApiError = require("../utils/ApiError");
const Product = require("../model/mealModel");
const ApiFeature = require("../utils/ApiFeature");
const qr = require("qrcode");

// @desc      get list of orders
// @route     GET  /api/v1/order
// @access    Private => (admin)
exports.getAllOrders = handleFactory.getListOfItems(Order, "order");

// @desc      get specific order
// @route     GET  /api/v1/order/:id
// @access    Private => (admin, user)
exports.getSpecificOrder = handleFactory.getOneItem(Order, "order");

// @desc      create cash order
// @route     POST  /api/v1/order
// @access    Private => (user)
exports.createCashOrder = expressAsyncHandler(async (req, res, next) => {
  // 1- get cart of user
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("no cart for this user", 404));
  }

  const orderItems = cart.cartItems;

  let totalPrice = cart.totalAfterDiscount || cart.total;

  // 2- create order
  const order = await Order.create({
    ...req.body,
    orderItems,
    user: req.user._id,
    totalPrice,
  });

  if (!order) {
    return next(new ApiError("something went wrong, try to order later", 400));
  }

  /* 
  3- generate qrcode
  @desc   add image to a base 64 url without upload it to file system
          after scan qrcode => display link   orderIsDelivered/:id  
          when go to this trigger action  @route  GET orderIsDelivered/:id  
  */
  await qr.toDataURL(
    `${process.env.BASE_URL}api/v1/delivery/orderIsDelivered/${order._id}`,
    async (err, url) => {
      order.qrImage = url;
      await order.save();
    }
  );

  // // another solution but in this solution we upload file to server
  // const serverPath = process.cwd();
  // try {
  //   await qr.toFile(
  //     `${serverPath}/src/uploads/QRs/order-${order._id}.png`,
  //     `${process.env.BASE_URL}/api/v1/delivery/orderIsDelivered/${order._id}`
  //   );
  //   order.qrImage = `order-${order._id}.png`;
  //   await order.save();
  // } catch (err) {
  //   console.log(err);
  // }

  // 4- update product sold
  orderItems.map(async (item) => {
    await Product.findOneAndUpdate(
      { _id: item.product },
      {
        $inc: { sold: item.count },
      },
      { new: true }
    );
  });

  // 5- if order created => delete cart
  // await Cart.findOneAndDelete({ user: req.user._id });

  res.status(200).json(order);
});

// @desc    get logged user orders
// @route   GET  /api/v1/userOrders
// @access  private => user
exports.getLoggedUserOrders = expressAsyncHandler(async (req, res, next) => {
  const countDocument = await Order.find({ user: req.user._id });

  const apiFeature = new ApiFeature(
    Order.find({ user: req.user._id }),
    req.query
  );
  apiFeature
    .filter()
    .limitFields()
    .sort()
    .search()
    .pagination(countDocument.length);

  const { mongooseQuery, paginationResults } = apiFeature;

  const response = await mongooseQuery;

  res.status(200).json({
    results: response.length,
    pagination: paginationResults,
    data: response,
  });
});

// @desc    delete order
// @route   DELETE  /api/v1/order/:id
// @access  private => (user, admin)
exports.deleteOrder = expressAsyncHandler(async (req, res, next) => {
  // 1- get order
  // 2- check if order status === new && user.role === 'user' => error (can't cancel order)
  // 2- if user.role === 'admin' => can delete it
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new ApiError("no order match this id"));
  }
  if (order) {
    if (req.user.role === "user" && order.orderStatus !== "new") {
      return next(
        new ApiError(
          `you can't cancel this order, order status is ${order.orderStatus}`
        )
      );
    }

    const orderItems = order.orderItems;
    // update sold in product
    orderItems.map(async (item) => {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: { sold: +item.count },
        },
        { new: true }
      );
    });
  }

  res.status(200).json({
    msg: "Order deleted successfully",
  });
});
