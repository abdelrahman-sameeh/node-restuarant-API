const { default: mongoose } = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Meal",
        },
        count: Number,
        price: Number,
        size: {
          type: String,
          enum: ["small", "medium", "large"],
        },
      },
    ],
    total: Number,
    totalAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  // .populate({ path: "user", select: 'email name' })
  this.populate({path: 'cartItems.product', select: '-reviews'})

  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
