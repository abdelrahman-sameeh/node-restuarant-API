const { default: mongoose } = require("mongoose");
const path = require("path");

const mealSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      minLength: [3, "Too short meal title"],
      maxLength: [30, "Too long meal title"],
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
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    favorites: [
      {
        type: String
      }
    ],
    ratingQty: {
      type: Number,
      default: 0,
    },
    ratingAvg: {
      type: Number,
      default: 0,
    },
    price: Number,
    count: Number,
  },
  { timestamps: true }
);

mealSchema.pre(/^find/, function (next) {
  this.populate({ path: "category" });
  next();
});

mealSchema.post("init", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/src/uploads/meals/${doc.image}`;
    doc.image = image;
  }
});

mealSchema.post("save", (doc) => {
  if (doc.image) {
    const image = `${process.env.BASE_URL}/src/uploads/meals/${doc.image}`;
    doc.image = image;
  }
});

const Meal = mongoose.model("Meal", mealSchema);

module.exports = Meal;
