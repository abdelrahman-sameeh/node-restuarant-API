const expressAsyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const handleFactory = require("./handleFactory");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const ApiError = require("../utils/ApiError");

// @desc  hashing password or SSH
exports.hashingPassOrSSH = async (req, res, next) => {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, 10);
  }
  if (req.body.SSH) {
    const hash = await crypto
      .createHash("sha512")
      .update(req.body.SSH)
      .digest("binary");
    req.body.SSH = hash;
  }
  next();
};

// *********************************  CRUD  *************************************
// @desc      create user
// @route     POST  /api/v1/createUser
// @access    private => admin
exports.createUser = handleFactory.createItem(User, "user");

// @desc      get one user
// @route     GET  /api/v1/user:id
// @access    private => admin
exports.getOneUser = handleFactory.getOneItem(User, "user");

// @desc      get list of users
// @route     GET  /api/v1/users
// @access    private => admin
exports.getListOfUsers = handleFactory.getListOfItems(User, "user");

// @desc      delete user
// @route     DELETE  /api/v1/user/:id
// @access    private => (admin)
exports.deleteUser = expressAsyncHandler(async (req, res, next) => {
  const response = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true }
  );
  if (!response) {
    return next(new ApiError("internal server error", 400));
  }
  res.status(200).json({
    msg: "user delete successfully",
    data: response,
  });
});

// --------------------------------  USER  ------------------------------------

// @desc      add one product into favorites
// @route     PUT  /api/v1/addProductToFavorite/:id
// @params    {id: id from product}
// @access    private => user
exports.addProductToFavorite = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const response = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favorites: id } },
    { new: true }
  );

  res.status(200).json({
    data: response,
  });
});

// @desc      remove one product into favorites
// @route     GET  /api/v1/deleteProductFromFavorite/:id
// @params    {id: id from product}
// @access    private => user
exports.deleteProductFromFavorite = expressAsyncHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const response = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: id } },
      { new: true }
    );
    res.status(200).json({
      data: response,
    });
  }
);

// @desc      get logged user
// @route     GET  /api/v1/user
// @access    public
exports.getLoggedUser = expressAsyncHandler(async (req, res, next) => {
  const response = await User.findById(req.user._id);
  res.status(200).json({
    data: response,
  });
});

// @desc      update user info
// @route     POST  /api/v1/updateUserInfo
// @access    private (auth)
exports.updateUserInfo = expressAsyncHandler(async (req, res, next) => {
  const email = req.user.email;
  const user = await User.findOne({ email });
  console.log(user);
  const check = await bcrypt.compare(req.body.password, user.password);
  const data = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.phone) {
    data.phone = req.body.phone;
  }

  if (!check) {
    return next(new ApiError("password is incorrect", 400));
  }

  const response = await User.findOneAndUpdate({ email }, data, {
    new: true,
  });
  return res.status(200).json({
    message: "update user profile successfully",
    data: {
      name: response.name,
      email: response.email,
      role: response.role,
      phone: response.phone
    },
  });
});
