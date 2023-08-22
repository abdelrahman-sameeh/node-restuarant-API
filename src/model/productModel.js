const { default: mongoose } = require("mongoose");
const path = require("path");

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [3, "Too short product title"],
      maxLength: [30, "Too long product title"],
    },
    details: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    size: {
      type: Array,
      trim: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        rate: {
          type: Number,
          min: [1, "Minimum rating must be equal 1"],
          max: [5, "Maximum rating must be equal 5"],
        },
      },
    ],
    ratingAvg: {
      type: Number,
      default: 0,
    },
    price: Number,
    count: Number,
  },
  { timestamps: true }
);

productSchema.post("init", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/products/${doc.image}`;
    doc.image = image;
  }
});

productSchema.post("save", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/products/${doc.image}`;
    doc.image = image;
  }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
