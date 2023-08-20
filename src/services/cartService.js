const expressAsyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Cart = require("../model/cartModel");
const Product = require("../model/productModel");
const ApiError = require("../utils/ApiError");
const handleFactory = require("./handleFactory");
const Coupon = require("../model/couponModel");

// @desc    add product to cart
// @route   POST  /api/v1/cart
// @access  private => user
exports.addProductToCart = expressAsyncHandler(async (req, res, next) => {
  // const user = await User.findById(req.user._id)
  let cart = await Cart.findOne({ user: req.user._id });

  const product = req.product;

  // 1- check if user have cart
  if (cart) {
    // --check if have product in listItems
    // if (true) > modify (else) add in listItems
    const cartItems = cart.cartItems;

    cart.totalAfterDiscount = undefined;

    const checkProductInCartItems = cartItems.some(
      (item) =>
        item.product.toString() === req.body.id.toString() &&
        item.size == req.body.size
    );
    if (checkProductInCartItems) {
      const newCartItems = cartItems.map((item) => {
        if (
          item.product.toString() === req.body.id.toString() &&
          item.size == req.body.size
        ) {
          item = {
            product: item.product,
            count: +item.count + +req.body.count,
            price: +product.price,
            _id: item._id,
            size: req.body.size,
          };
        }
        return item;
      });

      cart.cartItems = newCartItems;
      let total = newCartItems
        .map((item) => item.price * item.count)
        .reduce((acc, curr) => acc + curr);
      cart.total = total;
      await cart.save();
    } else {
      cartItems.push({
        product: req.body.id,
        count: req.body.count,
        price: +product.price,
        size: req.body.size ,
      });
      cart.cartItems = cartItems;

      let total = cartItems
        .map((item) => item.price * item.count)
        .reduce((acc, curr) => acc + curr);
      cart.total = total;

      await cart.save();
    }
  } else {
    // 2- if user don't have cart
    cart = await Cart.create({
      cartItems: [
        {
          product: req.body.id,
          count: req.body.count,
          price: +product.price,
          size: req.body.size||undefined,
        },
      ],
      user: req.user._id,
      total: +req.body.count * +product.price,
    });
  }

  res.status(200).json({
    data: cart,
  });
});

// @desc    get logged user cart
// @route   GET  /api/v1/cart
// @access  public
exports.getLoggedUserCart = expressAsyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("no cart found", 404));
  }
  res.status(200).json(cart);
});

// @desc    delete product from cartItem
// @route   PUT  /api/v1/cart
// @access  private => user
exports.deleteProductFromCartItems = expressAsyncHandler(
  async (req, res, next) => {
    // --check if cart
    // --check if product
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ApiError("no cart for this user", 404));
    }
    const cartItems = cart.cartItems;
    const product = cartItems.filter(
      (item) => item.product.toString() === req.body.id.toString()
    )[0];

    if (product) {
      const newCartItems = cartItems.filter(
        (item) => item.product.toString() !== req.body.id.toString()
      );
      cart.cartItems = newCartItems;

      // update total
      const total = +cart.total - +product.price;
      cart.total = total;
      await cart.save();
    } else {
      return next(new ApiError("no product match this id", 404));
    }

    res.status(200).json(cart);
  }
);

// @desc    get list of carts
// @route   GET  /api/v1/allCart
// @access  private => admin
exports.getAllCarts = handleFactory.getListOfItems(Cart, "cart");

// @desc    apply coupon to logged cart
// @route   PUT  /api/v1/applyCoupon/[couponName]
// @access  private => user
exports.applyCoupon = expressAsyncHandler(async (req, res, next) => {
  // 1- check if cart is exist
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("no cart for this user", 404));
  }

  // check if coupon is exist and not expired
  const coupon = await Coupon.findOne({ name: req.params.name });

  if (new Date(coupon.expire).getTime() < Date.now()) {
    return next(new ApiError("this coupon is already expired", 400));
  }

  // 3- update total price in cart
  const totalAfterDiscount = cart.total - (cart.total * coupon.discount) / 100;

  const response = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      totalAfterDiscount,
    },
    { new: true }
  );

  res.status(200).json({
    data: response,
  });
});
