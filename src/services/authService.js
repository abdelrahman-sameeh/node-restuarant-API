const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const JWT = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

const generateToken = (payload) =>
  JWT.sign(
    {
      userId: payload,
    },
    process.env.JWD_SECRET_KEY,
    {
      expiresIn: process.env.JWD_EXPIRE_DATE,
    }
  ); 

// @desc    create a signup
// @route   POST  /api/v1/register
// @access  public
exports.register = expressAsyncHandler(async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password,
  });

  const token = generateToken(user._id);

  res.status(200).json({
    data: user,
    token,
  });
});

// @desc    login in an email
// @route   POST  /api/v1/signup
// @access  public
exports.login = expressAsyncHandler(async (req, res, next) => {
  // 1- check if email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("This email not found", 400));
  }
  // 2- check if password match this email
  const checkPassword = await bcrypt.compare(req.body.password, user.password);

  if (!checkPassword) {
    return next(new ApiError("Email or password is incorrect", 400));
  }

  res.status(200).json({
    data: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token: generateToken(user._id),
  });
});

// @desc    change user password
// @route   POST  /api/v1/changePassword
// @access  private(user)
exports.changePassword = expressAsyncHandler(async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 10);
  const response = await User.findOneAndUpdate(
    { email: "user@gmail.com" },
    {
      password,
      changePasswordAt: Date.now(),
    },
    { new: true }
  );
  res.status(200).json({
    data: response,
  });
});

// @desc   check token validity
exports.protect = expressAsyncHandler(async (req, res, next) => {


  // 1- check if token sent
  const token = req.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : "";

  if (!token) {
    return next(
      new ApiError(
        "you are not login, please login to get access this route.",
        401
      )
    );
  }

  // 2- verify token (no change happen | expired token)
  const decoded = await JWT.verify(token, process.env.JWD_SECRET_KEY);


  //3- check if user exist
  const user = await User.findById(decoded.userId);
  if (!user) {
    return next(new ApiError("no user belong to this token", 403));
  }

  //4- check if user change password
  const changePasswordAt = new Date(user.changePasswordAt).getTime() / 1000;
  if (changePasswordAt > decoded.iat) {
    return next(
      new ApiError("you are change password yet, please login again", 403)
    );
  }

  req.user = user;
  next();
});

// @desc   set a permission for users
exports.allowTo = (...args) =>
  expressAsyncHandler((req, res, next) => {
    console.log(args);
    if (!args.includes(req.user.role)) {
      return next(
        new ApiError(
          `you have no permission for this route ${req.originalUrl}`,
          403
        )
      );
    }
    next();
  });
