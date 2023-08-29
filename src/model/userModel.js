const { default: mongoose, mongo } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: [2, "Too short user name"],
      maxLength: [25, "Too long user name"],
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      minLength: [4, "Too short password"],
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "delivery"],
      default: "user",
    },
    favorites: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Meal",
      },
    ],
    SSH: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    changePasswordAt: Date,
    passwordResetCode: String,
    expirePasswordResetCode: Date,
    changePassword: Boolean,
  },
  { timestamps: true }
);

userSchema.pre(/^find/, function () {
  this.populate({ path: "favorites" });
});

const User = mongoose.model("User", userSchema);

module.exports = User;
