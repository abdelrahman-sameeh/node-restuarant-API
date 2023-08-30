const { default: mongoose } = require("mongoose");

const addressSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    alias: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

addressSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name" });
  next();
});

const Address = mongoose.model("Address", addressSchema);

module.exports = Address;
