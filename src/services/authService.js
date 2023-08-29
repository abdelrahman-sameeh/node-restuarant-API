const crypto = require("crypto");
const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../model/userModel");
const JWT = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { sendEmail } = require("../utils/SendEmail");

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
    phone: req.body.phone,
  });

  const token = generateToken(user._id);

  res.status(201).json({
    status: 201,
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

  // check if email is active or not
  if (!user) {
    return next(new ApiError("This email not found", 400));
  }

  if (!user.isActive) {
    return next(new ApiError("This email deleted before", 400));
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
      phone: user.phone,
      _id: user._id
    },
    token: generateToken(user._id),
  });
});

// @desc    change user password
// @route   POST  /api/v1/changePassword
// @access  private(user)
exports.changePassword = expressAsyncHandler(async (req, res, next) => {
  const oldPassword = req.body.oldPassword;
  const compare = await bcrypt.compare(oldPassword, req.user.password);
  if (!compare) {
    return next(new ApiError("old password is incorrect", 400));
  }
  const password = await bcrypt.hash(req.body.password, 10);
  const response = await User.findOneAndUpdate(
    { email: req.user.email },
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

// @desc    forget password
// @route   POST  /api/v1/forgetPassword
// @access  auth(user, admin, delivery)
exports.forgetPassword = expressAsyncHandler(async (req, res, next) => {
  const receiver = req.body.email;
  // 1-check if email exist
  const user = await User.findOne({ email: receiver });
  if (!user) {
    return next(new ApiError("no user belong to this email", 404));
  }
  // 2- generate a specific number
  const mySecret = process.env.JWD_SECRET_KEY;
  let number = "";
  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * mySecret.length);
    number += mySecret[random];
  }

  // hashing password reset code
  const hash = await crypto.createHash("sha512").update(number).digest("hex");

  // 3- send email
  await sendEmail(receiver, number, res);

  user.passwordResetCode = hash;
  user.expirePasswordResetCode = Date.now();
  await user.save();
});

// @desc    forget password
// @route   POST  /api/v1/verifyPassword
// @access  auth(user, admin, delivery)
exports.verifyPasswordResetCode = expressAsyncHandler(
  async (req, res, next) => {
    const passwordResetCode = req.body.passwordResetCode;
    const hash = await crypto
      .createHash("sha512")
      .update(passwordResetCode)
      .digest("hex");
    const user = await User.findOne({ passwordResetCode: hash });

    if (!user) {
      return next(new ApiError("this password reset code is incorrect", 400));
    }

    if (
      Date.now() / 1000 -
        new Date(user.expirePasswordResetCode).getTime() / 1000 <
      10 * 60
    ) {
      user.changePassword = true;
      res.status(200).json({
        message: "you can change password now",
      });

      user.expirePasswordResetCode = undefined;
      user.passwordResetCode = undefined;

      await user.save();
    } else {
      user.changePassword = false;
      await user.save();
      return next(
        new ApiError(
          "you can't change password now, a password reset code is expired, reforget password again and try again",
          400
        )
      );
    }
  }
);

// @desc    change password after reset
// @route   POST  /api/v1/changePasswordAfterReset
// @access  protect(user, admin, delivery)
exports.changePasswordAfterReset = expressAsyncHandler(
  async (req, res, next) => {
    const email = req.body.email;
    // 1- check email has attr (changePassword === true)
    const user = await User.findOne({ email });
    if (!user.changePassword) {
      return next(new ApiError("can't change password for this email"));
    }
    user.password = await bcrypt.hash(req.body.password, 10);
    user.changePassword = undefined;
    await user.save();
    res.status(200).json({
      msg: "password has been changed successfully",
    });
  }
);
