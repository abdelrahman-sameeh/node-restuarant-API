const { default: mongoose } = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Meal",
          price: Number,
          count: Number,
        },
        count: Number,
        size: {
          type: String,
          enum: ["small", "medium", "large"],
        },
      },
    ],
    totalPrice: Number,
    qrImage: String,
    address: {
      type: mongoose.Schema.ObjectId,
      ref: "Address",
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    orderStatus: {
      type: String,
      default: "preparing",
      enum: ["preparing", "inDeliver", "delivered"],
    },
    deliveryMethod: {
      type: Boolean,
      default: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
    paidMethod: {
      type: String,
      default: "cash",
      enum: ["cash", "card"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    delivery: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: undefined
    },
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "address" })
    .populate({ path: "user", select: "name email" })
    .populate({
      path: "orderItems.product",
      select: "title price image details",
    });

  next();
});




const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
